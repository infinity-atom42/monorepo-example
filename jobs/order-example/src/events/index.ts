import type { ConfirmChannel, ConsumeMessage } from 'amqplib'

import { event } from '@packages/schemas/events'

import { orderCreated } from './order-created'
import { orderFailed } from './order-failed'

export const onMessage = (msg: ConsumeMessage | null, ch: ConfirmChannel) => {
	if (!msg) {
		console.warn('🔕 Something went wrong, unknown message consumed')
		return
	}
	try {
		const raw = JSON.parse(msg.content.toString())
		switch (msg.fields.routingKey) {
			case event.ORDER_CREATED.key: {
				const parsed = event.ORDER_CREATED.payload.parse(raw)
				orderCreated(parsed)
				break
			}
			case event.ORDER_FAILED.key: {
				const parsed = event.ORDER_FAILED.payload.parse(raw)
				orderFailed(parsed)
				break
			}
			default: {
				console.warn('🔕 Unknown routingKey, rejecting', msg.fields.routingKey)
				ch.nack(msg)
				return
			}
		}
		ch.ack(msg)
	} catch (err) {
		console.error('❌ Order message handling error', err)
		ch.nack(msg)
	}
}
