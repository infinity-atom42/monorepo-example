// promo-exchange -> email.queue
export async function onEmail(msg: unknown): Promise<void> {
	console.log('📧 email worker', msg.routingKey, msg.payload)
}
