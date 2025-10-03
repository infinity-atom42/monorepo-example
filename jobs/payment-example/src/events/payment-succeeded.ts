// payment-exchange -> payment.queue -> payment.succeeded
export async function onPaymentSucceeded(payload: unknown): Promise<void> {
	console.log('📥 payment.succeeded', payload)
}
