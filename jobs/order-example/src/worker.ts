import cluster from 'node:cluster'
import process from 'node:process'
import { connect } from 'amqp-connection-manager'
import type { ConfirmChannel } from 'amqplib'

import { onMessage } from './events'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://admin:admin@localhost:5672'
const workerId = cluster.worker?.id || 0

// Throttle connection error logs to once per hour
let lastErrorLogTime = 0
const ERROR_LOG_THROTTLE_MS = 60 * 60 * 1000 // 1 hour

export const connection = connect([RABBITMQ_URL])
connection.on('connect', () => console.log(`✅ Worker ${workerId} AMQP connected`))
connection.on('disconnect', ({ err }) => console.error(`❌ Worker ${workerId} AMQP disconnected:`, err.message || err))
connection.on('connectFailed', ({ err }) => {
	const now = Date.now()
	if (now - lastErrorLogTime < ERROR_LOG_THROTTLE_MS) {
		return // Skip logging if within throttle period
	}
	lastErrorLogTime = now
	
	const timestamp = new Date(now).toISOString()
	if (err.message.includes('ACCESS-REFUSED')) {
		console.error(`[${timestamp}] Worker ${workerId} attempt to connect to`, RABBITMQ_URL, 'was rejected')
	} else {
		console.error(`[${timestamp}] ❌ Worker ${workerId} AMQP connection failed:`, err.message || RABBITMQ_URL)
	}
})

export const channel = connection.createChannel({
	json: true,
	setup: async (ch: ConfirmChannel) => {
		await ch.assertExchange('order-exchange', 'topic', { durable: true })
		await ch.assertQueue('order.queue', { durable: true })
		await ch.bindQueue('order.queue', 'order-exchange', 'order.*')
		await ch.prefetch(10)

		await ch.consume('order.queue', (msg) => onMessage(msg, ch))
	},
})
