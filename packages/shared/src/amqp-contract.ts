import { topic, fanout, pipe, queue, bind, event } from '@workspace/amqp-orm'

// Schema (Drizzle-like style)

export type OrderCreated = {
	orderId: string,
	userId: string,
	total: number,
}
export const orderCreated = event('order.created', ???)

export type OrderFailed = {
	orderId: string,
	reason: string,
	code?: string,
}
export const orderFailed = event('order.failed', ???)

export type PaymentCreated = {
	paymentId: string,
	orderId: string,
	amount: number,
	currency: string,
	method?: string,
}
export const paymentCreated = event('payment.created', ???)

export type PaymentSucceeded = {
	paymentId: string,
	orderId: string,
	amount: number,
	currency: string,
	method?: string,
}
export const paymentSucceeded = event('payment.succeeded', ???)

export type PaymentFailed = {
	paymentId: string,
	orderId: string,
	reason: string,
	code?: string,
}
export const paymentFailed = event('payment.failed', ???)

export const orderExchange = topic('order-exchange', {
	events: {
		orderCreated,
		orderFailed,
	},
})

export const paymentExchange = topic('payment-exchange', {
	events: {
		paymentCreated,
		paymentSucceeded,
		paymentFailed,
	},
})

export const promoExchange = fanout('promo-exchange')

export const orderQueue         = queue('order.queue', [bind(orderExchange, 'order.*')])
export const paymentQueue       = queue('payment.queue', [bind(paymentExchange, 'payment.*')])
export const notificationsQueue = queue('notifications.queue', [bind(orderExchange, orderFailed), bind(paymentExchange, paymentFailed)])
export const emailQueue         = queue('email.queue', [bind(promoExchange, '')])
export const pushQueue          = queue('push.queue', [bind(promoExchange, '')])
export const analyticsQueue     = queue('analytics.queue', [bind(promoExchange, '')])

export const orderPipe = pipe(orderExchange, promoExchange, orderCreated)
export const paymentPipe = pipe(paymentExchange, promoExchange, paymentSucceeded)
