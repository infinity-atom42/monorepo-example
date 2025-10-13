import cluster from 'node:cluster'

import { runPrimary } from './primary'
import { runWorker } from './worker'

export type { ClusterConfig, WorkerContext } from './types'

/**
 * Start a clustered Node.js / Bun service
 *
 * In production: Spawns workers for each CPU core
 * In development: Runs a single worker
 *
 * Handles automatic worker restart on crash and graceful shutdown
 */
export async function startClusteredService<T = unknown>(config: import('./types').ClusterConfig<T>): Promise<void> {
	const shutdownTimeout = config.shutdownTimeoutMs ?? 10000

	if (cluster.isPrimary) {
		await runPrimary(config, shutdownTimeout)
	} else {
		await runWorker(config)
	}
}
