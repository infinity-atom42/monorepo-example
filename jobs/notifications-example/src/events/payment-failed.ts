import type { PaymentFailed } from '@packages/schemas/events'

export function paymentFailed(payload: PaymentFailed): void {
	console.log('� handle payment failed event', payload, 'sending critical payment failure notification')
}
