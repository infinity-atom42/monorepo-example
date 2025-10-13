import cluster from 'node:cluster'
import process from 'node:process'

import type { ClusterConfig, WorkerContext } from './types'

let isShuttingDown = false

/**
 * Run a worker process
 * Imports the worker module, handles startup, and registers shutdown handlers
 */
export async function runWorker<T>(config: ClusterConfig<T>): Promise<void> {
	// ========================================
	// Helper Functions
	// ========================================

	async function importWorkerModule(): Promise<T | null> {
		try {
			const workerModuleUrl = `file://${config.workerModulePath}`
			return await import(workerModuleUrl)
		} catch (error) {
			console.error(`Worker ${process.pid} failed to import module:`, error)
			console.error('Shutting down to prevent infinite restart loop')
			process.exit(1)
		}
	}

	async function callStartupCallback(workerModule: T): Promise<boolean> {
		try {
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

			return true
		} catch (error) {
			console.error(`Worker ${process.pid} startup callback failed:`, error)
			console.error('Shutting down to prevent infinite restart loop')
			process.exit(1)
		}
	}

	function createShutdownHandler(workerModule: T): () => Promise<void> {
		return async () => {
			// Prevent duplicate shutdown calls
			if (isShuttingDown) return
			isShuttingDown = true

			try {
				const context: WorkerContext<T> = {
					workerModule,
					pid: process.pid,
					workerId: cluster.worker?.id ?? 0,
				}

				// Call user's cleanup function
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
	}

	// ========================================
	// Phase 1: Import & Initialize Worker Module
	// ========================================

	const workerModule = await importWorkerModule()
	if (!workerModule) return // Import failed, process will exit

	// ========================================
	// Phase 2: Call Startup Callback
	// ========================================

	const startupSuccess = await callStartupCallback(workerModule)
	if (!startupSuccess) return // Startup failed, process will exit

	// ========================================
	// Phase 3: Register Shutdown Handlers
	// ========================================

	const shutdownWorker = createShutdownHandler(workerModule)
	process.on('SIGTERM', shutdownWorker)
	process.on('SIGINT', shutdownWorker)
}
