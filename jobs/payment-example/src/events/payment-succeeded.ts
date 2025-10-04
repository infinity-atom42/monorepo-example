import { type PaymentSucceeded } from '@workspace/shared/amqp-contract'

export async function onPaymentSucceeded(payload: PaymentSucceeded): Promise<void> {
	console.log('📥 payment.succeeded', payload)
}
