import process from 'node:process'

import { EXCHANGE_TYPES, createEventBus, type ExchangeType } from '@workspace/event-bus'

import { eventHandlers } from './events'

// Configuration
const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'
const SERVICE_NAME = process.env['SERVICE_NAME'] || 'job-example'
const EXCHANGE_NAME = process.env['EXCHANGE_NAME'] || 'order-exchange'
const EXCHANGE_TYPE = (process.env['EXCHANGE_TYPE'] as ExchangeType) || EXCHANGE_TYPES.TOPIC

// Initialize Event Bus
const bus = createEventBus({
	url: RABBITMQ_URL,
	exchangeName: EXCHANGE_NAME,
	exchangeType: EXCHANGE_TYPE,
	appId: SERVICE_NAME,
})

async function gracefulShutdown(): Promise<void> {
	try {
		console.log('\n🧹 Starting cleanup...')

		// Close Event Bus
		await bus.close()

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
			await bus.subscribe({
				event: event.eventName,
				queue: `${SERVICE_NAME}.${event.eventName}`,
				handler: event.handler,
			})
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
