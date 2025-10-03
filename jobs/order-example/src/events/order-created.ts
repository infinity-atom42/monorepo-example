import type { EventMap } from '@workspace/rabbitmq-helper'

export async function onOrderCreated(payload: EventMap['order-exchange']['order.created']): Promise<void> {
	console.log('📥 order.created', payload)
}
