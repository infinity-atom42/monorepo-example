import { type PaymentFailed } from '@workspace/shared/amqp-contract'

export async function onPaymentFailed(payload: PaymentFailed): Promise<void> {
	console.log('📥 payment.failed', payload)
}
