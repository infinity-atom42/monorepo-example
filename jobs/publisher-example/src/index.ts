import process from 'node:process'
import { connect } from 'amqp-connection-manager'
import type { ConfirmChannel } from 'amqplib'

import { ORDER_CREATED, ORDER_FAILED, PAYMENT_FAILED, PAYMENT_SUCCEEDED } from '@workspace/shared/events'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://admin:admin@localhost:5672'

const connection = connect([RABBITMQ_URL])
connection.on('connect', () => console.log('✅ AMQP connected'))
connection.on('disconnect', ({ err }) => console.error('❌ AMQP disconnected:', err.message || err))
connection.on('connectFailed', ({ err }) => {
	if (err.message.includes('ACCESS-REFUSED')) {
		console.error('Attempt to connect to', RABBITMQ_URL, 'was rejected')
	} else {
		console.error('❌ AMQP connection failed:', err.message || err)
	}
})

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

// Close connections and exit
await channel.close()
await connection.close()
console.log('✅ Connections closed, exiting...')
process.exit(0)
