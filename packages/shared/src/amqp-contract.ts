import { z } from 'zod'

import { bind, event, fanout, pipe, queue, topic } from '@workspace/amqp-orm'

// Zod schemas + inferred types

export const orderCreatedSchema = z.object({
	orderId: z.string(),
	userId: z.string(),
	total: z.number(),
})
export type OrderCreated = z.infer<typeof orderCreatedSchema>
export const orderCreated = event('order.created', orderCreatedSchema)

export const orderFailedSchema = z.object({
	orderId: z.string(),
	reason: z.string(),
	code: z.string().optional(),
})
export type OrderFailed = z.infer<typeof orderFailedSchema>
export const orderFailed = event('order.failed', orderFailedSchema)

export const paymentCreatedSchema = z.object({
	paymentId: z.string(),
	orderId: z.string(),
	amount: z.number(),
	currency: z.string(),
	method: z.string().optional(),
})
export type PaymentCreated = z.infer<typeof paymentCreatedSchema>
export const paymentCreated = event('payment.created', paymentCreatedSchema)

export const paymentSucceededSchema = z.object({
	paymentId: z.string(),
	orderId: z.string(),
	amount: z.number(),
	currency: z.string(),
	method: z.string().optional(),
})
export type PaymentSucceeded = z.infer<typeof paymentSucceededSchema>
export const paymentSucceeded = event('payment.succeeded', paymentSucceededSchema)

export const paymentFailedSchema = z.object({
	paymentId: z.string(),
	orderId: z.string(),
	reason: z.string(),
	code: z.string().optional(),
})
export type PaymentFailed = z.infer<typeof paymentFailedSchema>
export const paymentFailed = event('payment.failed', paymentFailedSchema)

export const orderExchange = topic('order-exchange', {
	orderCreated,
	orderFailed,
})

export const paymentExchange = topic('payment-exchange', {
	paymentCreated,
	paymentSucceeded,
	paymentFailed,
})

export const promoExchange = fanout('promo-exchange')

export const orderQueue = queue('order.queue', [bind(orderExchange, 'order.*')])
export const paymentQueue = queue('payment.queue', [bind(paymentExchange, 'payment.*')])
export const notificationsQueue = queue('notifications.queue', [
	bind(orderExchange, orderFailed),
	bind(paymentExchange, paymentFailed),
])
export const emailQueue = queue('email.queue', [bind(promoExchange, '')])
export const pushQueue = queue('push.queue', [bind(promoExchange, '')])
export const analyticsQueue = queue('analytics.queue', [bind(promoExchange, '')])

export const orderPipe = pipe(orderExchange, promoExchange, orderCreated)
export const paymentPipe = pipe(paymentExchange, promoExchange, paymentSucceeded)
