import type { QueueBindingsMap, MessageFor } from './events'
import type { ConfirmChannel, ConsumeMessage } from 'amqplib'

export type QueueName = keyof QueueBindingsMap & string

export function consumeQueue<Q extends QueueName>(
	connection: import('amqp-connection-manager').AmqpConnectionManager,
	queue: Q,
	handler: (msg: MessageFor<QueueBindingsMap[Q]>) => Promise<void>,
) {
	const channel = connection.createChannel({
		json: false,
		confirm: true,
		setup: async (ch: ConfirmChannel) => {
			await ch.prefetch(10)
			await ch.consume(
				queue,
				async (m: ConsumeMessage | null) => {
					if (!m) return
					try {
						const routingKey = m.fields.routingKey as keyof QueueBindingsMap[Q] & string
						const payload = JSON.parse(m.content.toString())
						await handler({ routingKey, payload } as any)
						channel.ack(m)
					} catch (err) {
						channel.nack(m, false, false)
					}
				},
				{ noAck: false },
			)
		},
	})
	return channel
}
