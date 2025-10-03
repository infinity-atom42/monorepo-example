// Minimal payloads for events
type OrderCreated = { orderId: string; userId: string; total: number }
type OrderFailed = { orderId: string; reason: string; code?: string }
type PaymentCreated = { paymentId: string; orderId: string; amount: number; currency: string }
type PaymentSucceeded = PaymentCreated & { method?: string }
type PaymentFailed = { paymentId: string; orderId: string; reason: string; code?: string }

export type EventMap = {
	'order-exchange': {
		'order.created': OrderCreated
		'order.failed': OrderFailed
	}
	'payment-exchange': {
		'payment.created': PaymentCreated
		'payment.succeeded': PaymentSucceeded
		'payment.failed': PaymentFailed
	}
	'promo-exchange': {}
}

export type MessageFor<M> = {
	[K in keyof M & string]: { routingKey: K; payload: M[K] }
}[keyof M & string]

export type QueueBindingsMap = {
	'order.queue': Pick<EventMap['order-exchange'], 'order.created' | 'order.failed'>
	'payment.queue': EventMap['payment-exchange']
	'notifications.queue': { 'order.failed': OrderFailed; 'payment.failed': PaymentFailed }
	'email.queue': { 'order.created': OrderCreated; 'payment.succeeded': PaymentSucceeded }
	'push.queue': { 'order.created': OrderCreated; 'payment.succeeded': PaymentSucceeded }
	'analytics.queue': { 'order.created': OrderCreated; 'payment.succeeded': PaymentSucceeded }
}
