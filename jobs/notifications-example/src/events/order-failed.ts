import type { OrderFailed } from '@workspace/shared/events'

export function orderFailed(payload: OrderFailed): void {
	console.log('📦 handle order failed event', payload, 'sending critical order failure notification')
}