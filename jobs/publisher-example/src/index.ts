import process from 'node:process'
import { connect } from 'amqp-connection-manager'
import type { ConfirmChannel } from 'amqplib'

import { ORDER_CREATED, ORDER_FAILED, PAYMENT_FAILED, PAYMENT_SUCCEEDED } from '@workspace/shared/events'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

const connection = connect([RABBITMQ_URL])
connection.on('connect', () => console.log('✅ AMQP connected'))
connection.on('disconnect', ({ err }) => console.error('❌ AMQP disconnected', err.stack || err))

const channel = connection.createChannel({
	json: true,
	setup: async (ch: ConfirmChannel) => {
		await ch.assertExchange('order-exchange', 'topic', { durable: true })
		await ch.assertExchange('payment-exchange', 'topic', { durable: true })
	},
})

await channel.waitForConnect()
console.log('🚀 Publishing demo events')

await channel.publish('order-exchange', ORDER_CREATED, { orderId: 'o_1', total: 42 }, { persistent: true })
await channel.publish('order-exchange', ORDER_FAILED, { orderId: 'o_2', reason: 'inventory_out' }, { persistent: true })
await channel.publish(
	'payment-exchange',
	PAYMENT_SUCCEEDED,
	{ paymentId: 'p_1', orderId: 'o_1', amount: 42, currency: 'USD' },
	{ persistent: true }
)
await channel.publish(
	'payment-exchange',
	PAYMENT_FAILED,
	{ paymentId: 'p_2', orderId: 'o_3', reason: 'card_declined' },
	{ persistent: true }
)

console.log('✅ Demo events published')

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

console.log('\n✅ Publisher service is running')
