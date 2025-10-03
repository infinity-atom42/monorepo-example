import process from 'node:process'

import { amqp } from '@workspace/amqp-orm'
import { contract } from '@workspace/shared'

import { events } from './events'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

const broker = amqp(RABBITMQ_URL, contract)

for (const event of events) {
	broker.consumeEvent(event)
}

async function gracefulShutdown(): Promise<void> {
	try {
		console.log('\n🧹 Starting cleanup...')
		await broker.close()
		console.log('✅ Cleanup completed')
		process.exit(0)
	} catch (error) {
		console.error('❌ Error during cleanup:', error)
		process.exit(1)
	}
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

console.log('\n✅ Notifications service is running')
