// promo-exchange -> push.queue
export async function onPush(msg: unknown): Promise<void> {
	console.log('📲 push worker', msg.routingKey, msg.payload)
}
