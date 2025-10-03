import type { MessageFor, QueueBindingsMap } from '@workspace/rabbitmq-helper'

export async function onEmail(msg: MessageFor<QueueBindingsMap['email.queue']>): Promise<void> {
	console.log('📧 email worker', msg.routingKey, msg.payload)
}
