import type { OrderFailed } from '@packages/shared/events'

export function orderFailed(payload: OrderFailed): void {
	console.log('📦 handle order failed event', payload, 'sending critical order failure notification')
}