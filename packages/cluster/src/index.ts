import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'

export interface WorkerContext<TWorkerModule = any> {
	workerModule: TWorkerModule
	pid: number
	workerId: number
}

export interface ClusterConfig<TWorkerModule = any> {
	serviceName: string
	isProduction: boolean
	workerModulePath: string // Absolute file path (use: new URL('./module.ts', import.meta.url).pathname)
	shutdownTimeoutMs?: number // Default: 10000ms

	// Primary process lifecycle
	onPrimaryStartup?: (context: { workerCount: number }) => void
	onPrimaryShutdown?: (context: { signal: string }) => void

	// Worker process lifecycle (runs in worker)
	onWorkerStartup?: (context: WorkerContext<TWorkerModule>) => void | Promise<void>
	onWorkerShutdown?: (context: WorkerContext<TWorkerModule>) => Promise<void>

	// Worker lifecycle from primary's perspective
	onWorkerSpawned?: (context: { workerId: number; pid: number; totalWorkers: number }) => void
	onWorkerCrashed?: (context: { workerId: number; pid: number; code: number | null; signal: string }) => void
	onWorkerExit?: (context: { workerId: number; pid: number }) => void
}

let isShuttingDown = false

export async function startClusteredService<T = any>(config: ClusterConfig<T>): Promise<void> {
	const shutdownTimeout = config.shutdownTimeoutMs ?? 10000

	if (cluster.isPrimary) {
		await runPrimary(config, shutdownTimeout)
	} else {
		await runWorker(config)
	}
}

async function runPrimary<T>(config: ClusterConfig<T>, shutdownTimeout: number): Promise<void> {
	const workerCount = config.isProduction ? os.availableParallelism() : 1
	const workerStartTimes = new Map<number, number>() // workerId -> spawn timestamp
	const STARTUP_FAILURE_THRESHOLD_MS = 5000 // If worker dies within 5s, it's a startup failure
	let shutdownTimeout_id: NodeJS.Timeout | null = null
	let workersAliveCount = workerCount

	// Start workers
	for (let i = 0; i < workerCount; i++) {
		const worker = cluster.fork()
		if (worker.process.pid) {
			workerStartTimes.set(worker.id, Date.now())
			config.onWorkerSpawned?.({
				workerId: worker.id,
				pid: worker.process.pid,
				totalWorkers: workerCount,
			})
		}
	}

	// Call primary startup callback or log default
	if (config.onPrimaryStartup) {
		config.onPrimaryStartup({ workerCount })
	} else {
		if (config.isProduction) {
			console.log(`Starting ${workerCount} workers in production mode`)
		} else {
			console.log('Starting single worker in development mode')
		}
	}

	// Handle worker exits (single handler for all cases)
	cluster.on('exit', (worker, code, signal) => {
		const pid = worker.process.pid ?? 0
		const workerId = worker.id

		if (!isShuttingDown) {
			// Check if worker died too quickly (startup failure)
			const startTime = workerStartTimes.get(workerId)
			const uptime = startTime ? Date.now() - startTime : Number.MAX_SAFE_INTEGER

			if (uptime < STARTUP_FAILURE_THRESHOLD_MS) {
				console.error(`Worker ${pid} died within ${uptime}ms of starting. This indicates a startup failure.`)
				console.error('Shutting down entire application to prevent infinite restart loop.')
				isShuttingDown = true
				process.exit(1)
			}

			// Clean up the old worker's timestamp to prevent memory leak
			workerStartTimes.delete(workerId)

			// Worker crashed unexpectedly during runtime
			if (config.onWorkerCrashed) {
				config.onWorkerCrashed({ workerId, pid, code, signal })
			} else {
				console.log(`Worker ${pid} died with code ${code} and signal ${signal}. Restarting...`)
			}

			const newWorker = cluster.fork()
			if (newWorker.id) {
				workerStartTimes.set(newWorker.id, Date.now())
			}
		} else {
			// Worker exited during shutdown
			config.onWorkerExit?.({ workerId, pid })

			// Clean up the worker's timestamp
			workerStartTimes.delete(workerId)

			// Count down workers during shutdown
			workersAliveCount--
			if (workersAliveCount === 0) {
				if (shutdownTimeout_id) {
					clearTimeout(shutdownTimeout_id)
				}
				console.log('All workers shut down successfully')
				process.exit(0)
			}
		}
	})

	// Graceful shutdown handler for primary process
	const shutdownPrimary = (signal: string) => {
		// Prevent multiple shutdown calls
		if (isShuttingDown) {
			return
		}

		if (config.onPrimaryShutdown) {
			config.onPrimaryShutdown({ signal })
		} else {
			console.log(`\n${signal} received in primary process. Shutting down gracefully...`)
		}

		isShuttingDown = true

		// Send shutdown signal to all workers
		for (const id in cluster.workers) {
			cluster.workers[id]?.kill('SIGTERM')
		}

		// Force exit if workers don't shut down within timeout
		shutdownTimeout_id = setTimeout(() => {
			console.log('Forcefully shutting down workers')
			for (const id in cluster.workers) {
				cluster.workers[id]?.kill('SIGKILL')
			}
			console.log('Forcefully shutting down primary process')
			process.exit(1)
		}, shutdownTimeout)
	}

	process.on('SIGTERM', () => shutdownPrimary('SIGTERM'))
	process.on('SIGINT', () => shutdownPrimary('SIGINT'))
}

async function runWorker<T>(config: ClusterConfig<T>): Promise<void> {
	let workerModule: T

	try {
		// Worker module path should already be absolute (resolved by caller with import.meta.url)
		const workerModuleUrl = `file://${config.workerModulePath}`

		// Import worker module (auto-starts on import)
		workerModule = await import(workerModuleUrl)

		// Call worker startup callback or log default
		const context: WorkerContext<T> = {
			workerModule,
			pid: process.pid,
			workerId: cluster.worker?.id ?? 0,
		}

		if (config.onWorkerStartup) {
			await config.onWorkerStartup(context)
		} else {
			console.log(`Worker ${process.pid} started`)
		}
	} catch (error) {
		console.error(`Worker ${process.pid} startup failed:`, error)
		console.error('Shutting down to prevent infinite restart loop')
		// Exit immediately without registering shutdown handlers
		// This prevents accessing uninitialized workerModule
		process.exit(1)
	}

	// Graceful shutdown handler for worker process
	// Only registered AFTER successful startup to ensure workerModule is initialized
	const shutdownWorker = async () => {
		if (isShuttingDown) return
		isShuttingDown = true

		try {
			const context: WorkerContext<T> = {
				workerModule,
				pid: process.pid,
				workerId: cluster.worker?.id ?? 0,
			}

			if (config.onWorkerShutdown) {
				await config.onWorkerShutdown(context)
			}

			console.log(`Worker ${process.pid} shut down successfully`)
			process.exit(0)
		} catch (error) {
			console.error(`Worker ${process.pid} shutdown error:`, error)
			process.exit(1)
		}
	}

	// Signal handlers registered AFTER successful startup
	process.on('SIGTERM', () => shutdownWorker())
	process.on('SIGINT', () => shutdownWorker())
}
