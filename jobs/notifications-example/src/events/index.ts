import type { MessageFor, QueueBindingsMap } from '@workspace/rabbitmq-helper'
import { onPaymentFailed } from './payment-failed'
import { onOrderFailed } from './order-failed'

type Handler = (msg: MessageFor<QueueBindingsMap['notifications.queue']>) => Promise<void>

const notificationsQueueHandler: Handler = async (msg) => {
	switch (msg.routingKey) {
		case 'order.failed':
			return onOrderFailed(msg.payload)
		case 'payment.failed':
			return onPaymentFailed(msg.payload)
	}
}

export const consumers = [
	{ queue: 'notifications.queue' as const, handler: notificationsQueueHandler },
]
