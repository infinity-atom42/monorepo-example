import type { MessageFor, QueueBindingsMap } from '@workspace/rabbitmq-helper'

export async function onAnalytics(msg: MessageFor<QueueBindingsMap['analytics.queue']>): Promise<void> {
	console.log('📈 analytics worker', msg.routingKey, msg.payload)
}
