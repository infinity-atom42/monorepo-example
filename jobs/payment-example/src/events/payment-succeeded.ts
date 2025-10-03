import type { EventMap } from '@workspace/rabbitmq-helper'

export async function onPaymentSucceeded(payload: EventMap['payment-exchange']['payment.succeeded']): Promise<void> {
	console.log('📥 payment.succeeded', payload)
}
