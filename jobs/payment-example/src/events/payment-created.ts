import { type PaymentCreated } from '@workspace/shared/amqp-contract'

export async function onPaymentCreated(payload: PaymentCreated): Promise<void> {
	console.log('📥 payment.created', payload)
}
