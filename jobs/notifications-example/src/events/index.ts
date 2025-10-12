import type { ConfirmChannel, ConsumeMessage } from 'amqplib'

import { event } from '@packages/schemas/events'

import { orderFailed } from './order-failed'
import { paymentFailed } from './payment-failed'

export const onMessage = (msg: ConsumeMessage | null, ch: ConfirmChannel) => {
	if (!msg) {
		console.warn('🔕 Something went wrong, unknown message consumed')
		return
	}
	try {
		const raw = JSON.parse(msg.content.toString())
		switch (msg.fields.routingKey) {
			case event.ORDER_FAILED.key: {
				event.ORDER_FAILED.payload.parse(raw)
				orderFailed(raw)
				break
			}
			case event.PAYMENT_FAILED.key: {
				event.PAYMENT_FAILED.payload.parse(raw)
				paymentFailed(raw)
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
		console.error('❌ Notifications message handling error', err)
		ch.nack(msg)
	}
}
