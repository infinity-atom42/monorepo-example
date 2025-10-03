import type { EventMap } from './events'

export type PublishFn = <E extends keyof EventMap, K extends keyof EventMap[E] & string>(
	exchange: E,
	routingKey: K,
	payload: EventMap[E][K],
	options?: import('amqplib').Options.Publish,
) => Promise<void>

export function createPublisher(
	connection: import('amqp-connection-manager').AmqpConnectionManager,
): PublishFn {
	const channel = connection.createChannel({ confirm: true, json: false })
	return async (exchange, routingKey, payload, options) => {
		const body = Buffer.from(JSON.stringify(payload))
		await channel.publish(String(exchange), String(routingKey), body, {
			contentType: 'application/json',
			persistent: true,
			...options,
		})
	}
}
