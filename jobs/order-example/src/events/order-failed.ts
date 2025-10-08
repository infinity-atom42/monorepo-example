import type { OrderFailed } from '@packages/events'

export function orderFailed(payload: OrderFailed): void {
	console.log('📦 handle order failed event', payload)
}
