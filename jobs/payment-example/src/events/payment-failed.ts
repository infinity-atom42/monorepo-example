import type { PaymentFailed } from '@workspace/shared/events'

export function paymentFailed(payload: PaymentFailed): void {
	console.log('💳 handle payment failed event', payload)
}
