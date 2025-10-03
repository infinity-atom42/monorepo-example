import { EXCHANGE_TYPES } from './types'
import type { ConfirmChannel } from 'amqplib'

export const TOPOLOGY = {
	exchanges: [
		{ name: 'order-exchange', type: EXCHANGE_TYPES.TOPIC, options: { durable: true } },
		{ name: 'payment-exchange', type: EXCHANGE_TYPES.TOPIC, options: { durable: true } },
		{ name: 'promo-exchange', type: EXCHANGE_TYPES.FANOUT, options: { durable: true } },
	],
	queues: [
		{ name: 'order.queue', options: { durable: true } },
		{ name: 'payment.queue', options: { durable: true } },
		{ name: 'notifications.queue', options: { durable: true } },
		{ name: 'email.queue', options: { durable: true } },
		{ name: 'push.queue', options: { durable: true } },
		{ name: 'analytics.queue', options: { durable: true } },
	],
	bindings: [
		{ queue: 'order.queue', exchange: 'order-exchange', pattern: 'order.*' },
		{ queue: 'payment.queue', exchange: 'payment-exchange', pattern: 'payment.*' },
		{ queue: 'notifications.queue', exchange: 'order-exchange', pattern: 'order.failed' },
		{ queue: 'notifications.queue', exchange: 'payment-exchange', pattern: 'payment.failed' },
		{ sourceExchange: 'order-exchange', destinationExchange: 'promo-exchange', pattern: 'order.created' },
		{ sourceExchange: 'payment-exchange', destinationExchange: 'promo-exchange', pattern: 'payment.succeeded' },
		{ queue: 'email.queue', exchange: 'promo-exchange', pattern: '' },
		{ queue: 'push.queue', exchange: 'promo-exchange', pattern: '' },
		{ queue: 'analytics.queue', exchange: 'promo-exchange', pattern: '' },
	],
} as const

export async function assertTopology(
	connection: import('amqp-connection-manager').AmqpConnectionManager,
): Promise<void> {
	const channel = connection.createChannel({
		confirm: true,
		json: false,
		setup: (ch: ConfirmChannel) => {
			return (async () => {
				for (const ex of TOPOLOGY.exchanges) {
					await ch.assertExchange(ex.name, ex.type, ex.options)
				}
				for (const q of TOPOLOGY.queues) {
					await ch.assertQueue(q.name, q.options)
				}
				for (const b of TOPOLOGY.bindings) {
					if ('sourceExchange' in b) {
						await ch.bindExchange(b.destinationExchange as string, b.sourceExchange as string, b.pattern)
					} else {
						await ch.bindQueue(b.queue as string, b.exchange as string, b.pattern)
					}
				}
			})()
		},
	})
	await channel.waitForConnect()
	await channel.close()
}
