import type { PaymentSucceeded } from '@packages/shared/events'

export function paymentSucceeded(payload: PaymentSucceeded): void {
	console.log('💳 handle payment succeeded event', payload)
}
