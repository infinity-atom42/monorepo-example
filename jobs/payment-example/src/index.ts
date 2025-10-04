import process from 'node:process'
import { connect } from 'amqp-connection-manager'
import type { ConfirmChannel } from 'amqplib'

import { onMessage } from './events'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

const connection = connect([RABBITMQ_URL])
connection.on('connect', () => console.log('✅ AMQP connected'))
connection.on('disconnect', ({ err }) => console.error('❌ AMQP disconnected', err.stack || err))

const channel = connection.createChannel({
	json: true,
	setup: async (ch: ConfirmChannel) => {
		await ch.assertExchange('payment-exchange', 'topic', { durable: true })
		await ch.assertQueue('payment.queue', { durable: true })
		await ch.bindQueue('payment.queue', 'payment-exchange', 'payment.*')
		await ch.prefetch(10)

		await ch.consume('payment.queue', (msg) => onMessage(msg, ch))
	},
})

async function gracefulShutdown(): Promise<void> {
	try {
		console.log('\n🧹 Starting cleanup...')
		await channel.close()
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

channel.waitForConnect().then(() => {
	console.log('\n✅ Payment service is running')
})
