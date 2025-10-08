import type { PaymentFailed } from '@packages/events'

export function paymentFailed(payload: PaymentFailed): void {
	console.log('💳 handle payment failed event', payload)
}
