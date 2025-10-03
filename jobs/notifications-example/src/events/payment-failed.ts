// payment-exchange -> notifications.queue -> payment.failed
export async function onPaymentFailed(payload: unknown): Promise<void> {
	console.log('🔔 notify: payment.failed', payload)
}
