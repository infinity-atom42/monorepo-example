import process from 'node:process'

import { PubSub } from '@workspace/pub-sub'

import { subscribers } from './subs'

// Configuration
const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'
// Initialize PubSub
const pubSub = new PubSub({
	url: RABBITMQ_URL,
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

async function startService(): Promise<void> {
	try {
		// Register all subscribers
		console.log(`\n📋 Registering ${subscribers.length} subscribers...`)
		for (const sub of subscribers) {
			await pubSub.subscribe(sub)
		}

		console.log('\n✅ Notification service is running')
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
