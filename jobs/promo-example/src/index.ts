import process from 'node:process'

import AmqpConnectionManager from '@workspace/rabbitmq-helper'
import { contract } from '@workspace/shared'

import { queues } from './queues'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

const broker = new AmqpConnectionManager(RABBITMQ_URL, contract)

for (const queue of queues) {
	broker.consumeQueue(queue)
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

console.log('\n✅ Promo service is running and listening to email/push/analytics queues')
