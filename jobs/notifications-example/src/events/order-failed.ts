import type { EventMap } from '@workspace/rabbitmq-helper'

export async function onOrderFailed(payload: EventMap['order-exchange']['order.failed']): Promise<void> {
	console.log('🔔 notify: order.failed', payload)
}
