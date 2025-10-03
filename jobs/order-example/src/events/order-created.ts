// order-exchange -> order.queue -> order.created
export async function onOrderCreated(payload: unknown): Promise<void> {
	console.log('📥 order.created', payload)
}
