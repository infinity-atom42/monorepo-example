/**
 * Context passed to worker lifecycle callbacks
 */
export interface WorkerContext<TWorkerModule = unknown> {
	workerModule: TWorkerModule
	pid: number
	workerId: number
}

/**
 * Configuration for the cluster manager
 */
export interface ClusterConfig<TWorkerModule = unknown> {
	// Required configuration
	serviceName: string
	isProduction: boolean
	workerModulePath: string // Use: new URL('./module.ts', import.meta.url).pathname

	// Optional configuration
	shutdownTimeoutMs?: number // Default: 10000ms

	// === Primary Process Callbacks ===
	onPrimaryStartup?: (context: { workerCount: number }) => void
	onPrimaryShutdown?: (context: { signal: string }) => void
	onWorkerSpawned?: (context: { workerId: number; pid: number; totalWorkers: number }) => void
	onWorkerCrashed?: (context: { workerId: number; pid: number; code: number | null; signal: string }) => void
	onWorkerExit?: (context: { workerId: number; pid: number }) => void

	// === Worker Process Callbacks ===
	onWorkerStartup?: (context: WorkerContext<TWorkerModule>) => void | Promise<void>
	onWorkerShutdown?: (context: WorkerContext<TWorkerModule>) => Promise<void>
}
