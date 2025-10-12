import { connect } from 'amqp-connection-manager'
import type { ConfirmChannel } from 'amqplib'

import { event, exchange, queue } from '@packages/schemas/events'

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
		await ch.assertExchange(exchange.ORDER, 'topic', { durable: true })
		await ch.assertExchange(exchange.PAYMENT, 'topic', { durable: true })
		await ch.assertQueue(queue.NOTIFICATIONS, { durable: true })
		await ch.bindQueue(queue.NOTIFICATIONS, exchange.ORDER, event.ORDER_FAILED.key)
		await ch.bindQueue(queue.NOTIFICATIONS, exchange.PAYMENT, event.PAYMENT_FAILED.key)
		await ch.prefetch(10)
		await ch.consume(queue.NOTIFICATIONS, (msg) => onMessage(msg, ch))
	},
})

export { connection, channel }
