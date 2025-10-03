// payment-exchange -> payment.queue -> payment.created
export async function onPaymentCreated(payload: unknown): Promise<void> {
	console.log('📥 payment.created', payload)
}
