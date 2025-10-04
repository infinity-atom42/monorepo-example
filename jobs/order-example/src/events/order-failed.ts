// order-exchange -> order.queue -> order.failed
import { type OrderFailed } from '@workspace/shared/amqp-contract'

export async function onOrderFailed (payload: OrderFailed): Promise<void> {
	console.log('📥 order.failed', payload)
}
