import type { MessageFor, QueueBindingsMap } from '@workspace/rabbitmq-helper'

export async function onPush(msg: MessageFor<QueueBindingsMap['push.queue']>): Promise<void> {
	console.log('📲 push worker', msg.routingKey, msg.payload)
}
