import type { EventMap } from '@workspace/rabbitmq-helper'

export async function onPaymentFailed(payload: EventMap['payment-exchange']['payment.failed']): Promise<void> {
	console.log('🔔 notify: payment.failed', payload)
}
