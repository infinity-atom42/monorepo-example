import type { ConfirmChannel, ConsumeMessage } from 'amqplib'

import { ORDER_CREATED, ORDER_FAILED, OrderCreatedSchema, OrderFailedSchema } from '@packages/shared/events'

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
			case ORDER_CREATED: {
				const parsed = OrderCreatedSchema.parse(raw)
				orderCreated(parsed)
				break
			}
			case ORDER_FAILED: {
				const parsed = OrderFailedSchema.parse(raw)
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
