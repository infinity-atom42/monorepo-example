import type { OrderCreated } from '@packages/shared/events'

export function orderCreated(payload: OrderCreated): void {
	console.log('📦 handle order created event', payload)
}
