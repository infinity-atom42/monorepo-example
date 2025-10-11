import { startClusteredService } from '@packages/cluster'
import { env } from '@se/env'

await startClusteredService<typeof import('./server')>({
	serviceName: 'server-example',
	isProduction: env.NODE_ENV === 'production',
	workerModulePath: new URL('./server.ts', import.meta.url).pathname,
	onPrimaryStartup: ({ workerCount }) => {
		if (env.NODE_ENV === 'production') {
			console.log(`Starting ${workerCount} workers in production mode`)
		} else {
			console.log('Starting single worker in development mode')
		}
		const serverUrl = `http://localhost:${env.PORT}`
		console.log(`🦊 Elysia is running at ${serverUrl}`)
		console.log(`🔗 OpenAPI documentation: ${serverUrl}/openapi`)
	},
	onPrimaryShutdown: ({ signal }) => {
		console.log(`\n${signal} received in primary process. Shutting down gracefully...`)
	},
	onWorkerStartup: ({ pid }) => {
		console.log(`Worker ${pid} started`)
	},
	onWorkerCrashed: ({ pid, code, signal }) => {
		console.log(`Worker ${pid} died with code ${code} and signal ${signal}. Restarting...`)
	},
	onWorkerShutdown: async ({ workerModule }) => {
		await workerModule.app.server?.stop()
		await workerModule.pool.end()
	},
})
