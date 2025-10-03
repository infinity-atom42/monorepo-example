// order-exchange -> notifications.queue -> order.failed
export async function onOrderFailed(payload: unknown): Promise<void> {
	console.log('🔔 notify: order.failed', payload)
}
