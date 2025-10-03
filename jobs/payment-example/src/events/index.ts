import type { MessageFor, QueueBindingsMap } from '@workspace/rabbitmq-helper'
import { onPaymentCreated } from './payment-created'
import { onPaymentSucceeded } from './payment-succeeded'

type Handler = (msg: MessageFor<QueueBindingsMap['payment.queue']>) => Promise<void>

const paymentQueueHandler: Handler = async (msg) => {
	switch (msg.routingKey) {
		case 'payment.created':
			return onPaymentCreated(msg.payload)
		case 'payment.succeeded':
			return onPaymentSucceeded(msg.payload)
		case 'payment.failed':
			console.log('📥 payment.failed', msg.payload)
	}
}

export const consumers = [
	{ queue: 'payment.queue' as const, handler: paymentQueueHandler },
]
