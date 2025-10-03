import process from 'node:process'
import { createConnection, assertTopology, consumeQueue } from '@workspace/rabbitmq-helper'
import { consumers } from './events'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

const connection = createConnection(RABBITMQ_URL)

await assertTopology(connection)

for (const c of consumers) {
	consumeQueue(connection, c.queue, c.handler)
}

async function gracefulShutdown(): Promise<void> {
	try {
		console.log('\n🧹 Starting cleanup...')
		await connection.close()
		console.log('✅ Cleanup completed')
		process.exit(0)
	} catch (error) {
		console.error('❌ Error during cleanup:', error)
		process.exit(1)
	}
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

console.log('\n✅ Order service is running')
