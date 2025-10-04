export async function onAnalytics(msg: unknown): Promise<void> {
	console.log('📈 analytics worker', msg.routingKey, msg.payload)
}
