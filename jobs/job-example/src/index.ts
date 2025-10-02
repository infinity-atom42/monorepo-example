import process from 'node:process'
import RabbitMQService from './lib/rabbitmq'
import { eventHandlers } from './events'

// Configuration
const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'
const EXCHANGE_NAME = process.env['EXCHANGE_NAME'] || 'order-exchange'
const EXCHANGE_TYPE = (process.env['EXCHANGE_TYPE'] || 'topic') as
	| 'direct'
	| 'topic'
	| 'headers'
	| 'fanout'
	| 'match'

// Initialize RabbitMQ service
const rabbitmqService = new RabbitMQService({
	url: RABBITMQ_URL,
	exchangeName: EXCHANGE_NAME,
	exchangeType: EXCHANGE_TYPE,
})

async function gracefulShutdown(): Promise<void> {
	try {
		console.log('\n🧹 Starting cleanup...')

		// Close RabbitMQ connection
		await rabbitmqService.close()

		console.log('✅ Cleanup completed')
		process.exit(0)
	} catch (error) {
		console.error('❌ Error during cleanup:', error)
		process.exit(1)
	}
}

async function startService(): Promise<void> {
	try {
		// Register all event handlers
		console.log(`\n📋 Registering ${eventHandlers.length} event handlers...`)
		for (const event of eventHandlers) {
			await rabbitmqService.subscribe(
				event.queueName,
				event.routingKey,
				event.handler
			)
		}

		console.log('\n✅ Event listener service is running')
		console.log('   Press Ctrl+C to stop\n')
	} catch (error) {
		console.error('❌ Failed to start service:', error)
		process.exit(1)
	}
}

// Handle SIGINT (Ctrl+C in terminal)
// Handle SIGTERM (kill command, Docker stop, etc.)
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

// Start the service
startService()
