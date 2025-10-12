import type { ConfirmChannel, ConsumeMessage } from 'amqplib'

import { event } from '@packages/schemas/events'

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
			case event.PAYMENT_SUCCEEDED.key: {
				const parsed = event.PAYMENT_SUCCEEDED.payload.parse(raw)
				paymentSucceeded(parsed)
				break
			}
			case event.PAYMENT_FAILED.key: {
				const parsed = event.PAYMENT_FAILED.payload.parse(raw)
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
