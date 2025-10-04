import type { PaymentSucceeded } from '@workspace/shared/events'

export function paymentSucceeded(payload: PaymentSucceeded): void {
	console.log('💳 handle payment succeeded event', payload)
}
