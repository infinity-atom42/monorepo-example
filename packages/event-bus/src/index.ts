import amqp, { type AmqpConnectionManager, type ChannelWrapper } from 'amqp-connection-manager'
import type { Channel, ConsumeMessage, Options } from 'amqplib'

import type { EventName, EventPayload, RoutingKey } from '@workspace/events'

export const EXCHANGE_TYPES = {
	DIRECT: 'direct',
	TOPIC: 'topic',
	HEADERS: 'headers',
	FANOUT: 'fanout',
} as const
export type ExchangeType = (typeof EXCHANGE_TYPES)[keyof typeof EXCHANGE_TYPES]

export interface EventBusConfig {
	url: string
	exchangeName: string
	exchangeType?: ExchangeType
	appId: string
}

export interface SubscribeParams<E extends EventName> {
	event: E | `${string}.${string}` // allow wildcards like 'orders.*'
	queue: string
	prefetch?: number
	handler: (payload: EventPayload<E>) => Promise<void> | void
}

export interface EventBus {
	publish: <E extends EventName>(event: E, payload: EventPayload<E>, opts?: Options.Publish) => Promise<void>
	subscribe: <E extends EventName>(params: SubscribeParams<E>) => Promise<void>
	close: () => Promise<void>
}

export function createEventBus(config: EventBusConfig): EventBus {
	const exchangeType: ExchangeType = config.exchangeType ?? 'topic'
	const connection: AmqpConnectionManager = amqp.connect(config.url, {
		heartbeatIntervalInSeconds: 30,
		reconnectTimeInSeconds: 10,
	})

	let publisher: ChannelWrapper | undefined
	let consumer: ChannelWrapper | undefined

	function ensureExchange(channel: Channel): Promise<any> {
		return channel.assertExchange(config.exchangeName, exchangeType, { durable: true })
	}

	function getPublisher(): ChannelWrapper {
		if (publisher) return publisher
		publisher = connection.createChannel({
			confirm: true,
			setup: async (channel: Channel) => {
				await ensureExchange(channel)
			},
		})
		return publisher
	}

	function getConsumer(prefetch?: number): ChannelWrapper {
		if (consumer) return consumer
		consumer = connection.createChannel({
			setup: async (channel: Channel) => {
				await ensureExchange(channel)
				await channel.prefetch(prefetch ?? 1)
			},
		})
		return consumer
	}

	async function publish<E extends EventName>(
		event: E,
		payload: EventPayload<E>,
		opts?: Options.Publish
	): Promise<void> {
		const ch = getPublisher()
		await ch.publish(config.exchangeName, event as RoutingKey, Buffer.from(JSON.stringify(payload)), {
			appId: config.appId,
			contentType: 'application/json',
			persistent: true,
			...(opts ?? {}),
		})
	}

	async function subscribe<E extends EventName>(params: SubscribeParams<E>): Promise<void> {
		const ch = getConsumer(params.prefetch)
		await ch.addSetup(async (channel: Channel) => {
			await channel.assertQueue(params.queue, { durable: true })
			await channel.bindQueue(params.queue, config.exchangeName, params.event as RoutingKey)
			await channel.consume(
				params.queue,
				async (msg: ConsumeMessage | null) => {
					if (!msg) return
					try {
						const content = JSON.parse(msg.content.toString()) as EventPayload<E>
						await params.handler(content)
						channel.ack(msg)
					} catch (err) {
						channel.nack(msg, false, true)
					}
				},
				{ noAck: false }
			)
		})
	}

	async function close(): Promise<void> {
		try {
			if (publisher) await publisher.close().catch(() => {})
			if (consumer) await consumer.close().catch(() => {})
			await connection.close()
		} catch {}
	}

	return { publish, subscribe, close }
}
