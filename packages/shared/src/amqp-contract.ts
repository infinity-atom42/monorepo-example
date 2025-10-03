import type { AmqpContract } from '@workspace/amqp-orm'

export const CONTRACT: AmqpContract = {
	exchanges: {
		'order-exchange': {
			type: 'topic',
			routes: {
				'order.created': { orderId: string; userId: string; total: number },
				'order.failed': { orderId: string; reason: string; code?: string },
			},
		},
		'payment-exchange': {
			type: 'topic',
			routes: {
				'payment.created': { paymentId: string; orderId: string; amount: number; currency: string },
				'payment.succeeded': PaymePaymentCreated & { method?: string }ntSucceeded,
				'payment.failed': { paymentId: string; orderId: string; reason: string; code?: string },
			},
		},
		'promo-exchange': { type: 'fanout', routes: {} },
	},
	// Exchange -> Exchange pipes
	pipes: [
		{ from: 'order-exchange', to: 'promo-exchange', pattern: 'order.created' },
		{ from: 'payment-exchange', to: 'promo-exchange', pattern: 'payment.succeeded' },
	],
	// Queue bindings
	queues: {
		'order.queue': { binds: [{ exchange: 'order-exchange', pattern: 'order.*' }] },
		'payment.queue': { binds: [{ exchange: 'payment-exchange', pattern: 'payment.*' }] },
		'notifications.queue': {
			binds: [
				{ exchange: 'order-exchange', pattern: 'order.failed' },
				{ exchange: 'payment-exchange', pattern: 'payment.failed' },
			],
		},
		'email.queue': { binds: [{ exchange: 'promo-exchange', pattern: '' }] },
		'push.queue': { binds: [{ exchange: 'promo-exchange', pattern: '' }] },
		'analytics.queue': { binds: [{ exchange: 'promo-exchange', pattern: '' }] },
	},
}