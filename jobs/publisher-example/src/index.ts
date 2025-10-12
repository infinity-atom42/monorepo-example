import process from 'node:process'
import { connect } from 'amqp-connection-manager'
import type { ConfirmChannel } from 'amqplib'

import { event, exchange } from '@packages/schemas/events'

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
		await ch.assertExchange(exchange.ORDER, 'topic', { durable: true })
		await ch.assertExchange(exchange.PAYMENT, 'topic', { durable: true })
	},
})

await channel.waitForConnect()
console.log('🚀 Publishing demo events')

await channel.publish(exchange.ORDER, event.ORDER_CREATED.key, { orderId: 'o_1', total: 42 }, { persistent: true })
await channel.publish(exchange.ORDER, event.ORDER_FAILED.key, { orderId: 'o_2', reason: 'inventory_out' }, { persistent: true })
await channel.publish(
	exchange.PAYMENT,
	event.PAYMENT_SUCCEEDED.key,
	{ paymentId: 'p_1', orderId: 'o_1', amount: 42, currency: 'USD' },
	{ persistent: true }
)
await channel.publish(
	exchange.PAYMENT,
	event.PAYMENT_FAILED.key,
	{ paymentId: 'p_2', orderId: 'o_3', reason: 'card_declined' },
	{ persistent: true }
)

console.log('✅ Demo events published')

// Close connections and exit
await channel.close()
await connection.close()
console.log('✅ Connections closed, exiting...')
process.exit(0)
