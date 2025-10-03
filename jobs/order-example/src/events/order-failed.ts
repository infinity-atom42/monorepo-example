// order-exchange -> order.queue -> order.failed
export async function onOrderFailed(payload: unknown): Promise<void> {
	console.log('📥 order.failed', payload)
}
