import { startClusteredService } from '@packages/cluster'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://admin:admin@localhost:5672'

await startClusteredService({
	serviceName: 'order-example',
	isProduction: process.env['NODE_ENV'] === 'production',
	workerModulePath: new URL('./worker.ts', import.meta.url).pathname,
	onPrimaryStartup: ({ workerCount }) => {
		console.log(`\n🚀 Order service is starting...`)
		console.log(`📡 RabbitMQ URL: ${RABBITMQ_URL}`)
		if (process.env['NODE_ENV'] === 'production') {
			console.log(`Starting ${workerCount} workers in production mode`)
		} else {
			console.log('Starting single worker in development mode')
		}
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
		await workerModule.channel.close()
		await workerModule.connection.close()
	},
})
