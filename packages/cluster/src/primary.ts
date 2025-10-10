import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'

import type { ClusterConfig } from './types'

// Constants
const STARTUP_FAILURE_THRESHOLD_MS = 5000 // Worker must survive 5s to avoid shutdown

// Module state
let isShuttingDown = false

/**
 * Run the primary/master process
 * Manages worker spawning, monitoring, and graceful shutdown
 */
export async function runPrimary<T>(config: ClusterConfig<T>, shutdownTimeout: number): Promise<void> {
	const workerCount = config.isProduction ? os.availableParallelism() : 1
	const workerStartTimes = new Map<number, number>()
	let shutdownTimeoutId: NodeJS.Timeout | null = null
	let workersAliveCount = workerCount

	// ========================================
	// Helper Functions
	// ========================================

	function handleCrashOrRestart(workerId: number, pid: number, code: number | null, signal: string): void {
		// Check if worker died too quickly (startup failure)
		const startTime = workerStartTimes.get(workerId)
		const uptime = startTime ? Date.now() - startTime : Number.MAX_SAFE_INTEGER

		if (uptime < STARTUP_FAILURE_THRESHOLD_MS) {
			console.error(`Worker ${pid} died within ${uptime}ms of starting. This indicates a startup failure.`)
			console.error('Shutting down entire application to prevent infinite restart loop.')
			isShuttingDown = true
			process.exit(1)
		}

		// Clean up old worker timestamp
		workerStartTimes.delete(workerId)

		// Log crash
		if (config.onWorkerCrashed) {
			config.onWorkerCrashed({ workerId, pid, code, signal })
		} else {
			console.log(`Worker ${pid} died with code ${code} and signal ${signal}. Restarting...`)
		}

		// Spawn replacement worker
		const newWorker = cluster.fork()
		if (newWorker.id) {
			workerStartTimes.set(newWorker.id, Date.now())
		}
	}

	function handleCleanExit(workerId: number, pid: number): void {
		config.onWorkerExit?.({ workerId, pid })
		workerStartTimes.delete(workerId)

		// Count down remaining workers
		workersAliveCount--
		if (workersAliveCount === 0) {
			if (shutdownTimeoutId) {
				clearTimeout(shutdownTimeoutId)
			}
			console.log('All workers shut down successfully')
			process.exit(0)
		}
	}

	function createShutdownHandler(): (signal: string) => void {
		return (signal: string) => {
			// Prevent duplicate shutdown calls
			if (isShuttingDown) return
			
			// Log shutdown
			if (config.onPrimaryShutdown) {
				config.onPrimaryShutdown({ signal })
			} else {
				console.log(`\n${signal} received in primary process. Shutting down gracefully...`)
			}

			isShuttingDown = true

			// Kill all workers gracefully
			for (const id in cluster.workers) {
				cluster.workers[id]?.kill('SIGTERM')
			}

			// Set force-kill timeout
			shutdownTimeoutId = setTimeout(() => {
				console.log('Forcefully shutting down workers')
				for (const id in cluster.workers) {
					cluster.workers[id]?.kill('SIGKILL')
				}
				console.log('Forcefully shutting down primary process')
				process.exit(1)
			}, shutdownTimeout)
		}
	}

	// ========================================
	// Phase 1: Spawn Workers
	// ========================================
	
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

	// ========================================
	// Phase 2: Log Startup
	// ========================================
	
	if (config.onPrimaryStartup) {
		config.onPrimaryStartup({ workerCount })
	} else {
		const mode = config.isProduction ? 'production' : 'development'
		console.log(`Starting ${workerCount} worker(s) in ${mode} mode`)
	}

	// ========================================
	// Phase 3: Handle Worker Exits
	// ========================================
	
	cluster.on('exit', (worker, code, signal) => {
		const pid = worker.process.pid ?? 0
		const workerId = worker.id

		if (isShuttingDown) {
			handleCleanExit(workerId, pid)
		} else {
			handleCrashOrRestart(workerId, pid, code, signal)
		}
	})

	// ========================================
	// Phase 4: Register Shutdown Handlers
	// ========================================
	
	const shutdownPrimary = createShutdownHandler()
	process.on('SIGTERM', () => shutdownPrimary('SIGTERM'))
	process.on('SIGINT', () => shutdownPrimary('SIGINT'))
}
