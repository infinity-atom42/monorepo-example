import type { MessageFor, QueueBindingsMap } from '@workspace/rabbitmq-helper'
import { onOrderCreated } from './order-created'
import { onOrderFailed } from './order-failed'

type Handler = (msg: MessageFor<QueueBindingsMap['order.queue']>) => Promise<void>

const orderQueueHandler: Handler = async (msg) => {
	switch (msg.routingKey) {
		case 'order.created':
			return onOrderCreated(msg.payload)
		case 'order.failed':
			return onOrderFailed(msg.payload)
	}
}

export const consumers = [
	{ queue: 'order.queue' as const, handler: orderQueueHandler },
]
