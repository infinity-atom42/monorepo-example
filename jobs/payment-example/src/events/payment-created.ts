import type { EventMap } from '@workspace/rabbitmq-helper'

export async function onPaymentCreated(payload: EventMap['payment-exchange']['payment.created']): Promise<void> {
	console.log('📥 payment.created', payload)
}
