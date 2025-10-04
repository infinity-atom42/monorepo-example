import { type OrderCreated } from '@workspace/shared/amqp-contract'

export async function onOrderCreated(payload: OrderCreated): Promise<void> {
	console.log('📥 order.created', payload)
}
