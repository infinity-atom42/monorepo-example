import { connect } from 'amqp-connection-manager'
import type { ConfirmChannel } from 'amqplib'

import { ORDER_FAILED, PAYMENT_FAILED } from '@packages/events'

import { onMessage } from './events'

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
		await ch.assertQueue('notifications.queue', { durable: true })
		await ch.bindQueue('notifications.queue', 'order-exchange', ORDER_FAILED)
		await ch.bindQueue('notifications.queue', 'payment-exchange', PAYMENT_FAILED)
		await ch.prefetch(10)
		await ch.consume('notifications.queue', (msg) => onMessage(msg, ch))
	},
})

export { connection, channel }
