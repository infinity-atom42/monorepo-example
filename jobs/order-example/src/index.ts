import process from 'node:process'

import { PubSub } from '@workspace/pub-sub'

import { events } from './events'

// Configuration
const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

// Initialize PubSub
const pubSub = new PubSub({
	url: RABBITMQ_URL,
	queueName: 'orders',
	exchangeName: 'orders',
	exchangeType: 'topic', // topic is the default
})

async function gracefulShutdown(): Promise<void> {
	try {
		console.log('\n🧹 Starting cleanup...')

		// Close PubSub
		await pubSub.close()

		console.log('✅ Cleanup completed')
		process.exit(0)
	} catch (error) {
		console.error('❌ Error during cleanup:', error)
		process.exit(1)
	}
}

// Handle SIGINT (Ctrl+C in terminal)
// Handle SIGTERM (kill command, Docker stop, etc.)
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

console.log('\n✅ Order service is running')
