import type { PaymentFailed } from '@packages/shared/events'

export function paymentFailed(payload: PaymentFailed): void {
	console.log('� handle payment failed event', payload, 'sending critical payment failure notification')
}