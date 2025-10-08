import type { PaymentSucceeded } from '@packages/events'

export function paymentSucceeded(payload: PaymentSucceeded): void {
	console.log('💳 handle payment succeeded event', payload)
}
