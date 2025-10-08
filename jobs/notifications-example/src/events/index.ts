import type { ConfirmChannel, ConsumeMessage } from 'amqplib'

import { ORDER_FAILED, OrderFailedSchema, PAYMENT_FAILED, PaymentFailedSchema } from '@packages/events'

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
			case ORDER_FAILED: {
				OrderFailedSchema.parse(raw)
				orderFailed(raw)
				break
			}
			case PAYMENT_FAILED: {
				PaymentFailedSchema.parse(raw)
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
