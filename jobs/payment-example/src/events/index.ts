import type { ConfirmChannel, ConsumeMessage } from 'amqplib'

import { PAYMENT_FAILED, PAYMENT_SUCCEEDED, PaymentFailedSchema, PaymentSucceededSchema } from '@packages/events'

import { paymentFailed } from './payment-failed'
import { paymentSucceeded } from './payment-succeeded'

export const onMessage = (msg: ConsumeMessage | null, ch: ConfirmChannel) => {
	if (!msg) {
		console.warn('🔕 Something went wrong, unknown message consumed')
		return
	}
	try {
		const raw = JSON.parse(msg.content.toString())
		switch (msg.fields.routingKey) {
			case PAYMENT_SUCCEEDED: {
				const parsed = PaymentSucceededSchema.parse(raw)
				paymentSucceeded(parsed)
				break
			}
			case PAYMENT_FAILED: {
				const parsed = PaymentFailedSchema.parse(raw)
				paymentFailed(parsed)
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
		console.error('❌ Payment message handling error', err)
		ch.nack(msg)
	}
}
