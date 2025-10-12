import { z } from 'zod'

/**
 * RabbitMQ exchanges
 */
export const exchange = {
	ORDER: 'order-exchange' as const,
	PAYMENT: 'payment-exchange' as const,
} as const

/**
 * RabbitMQ queues
 */
export const queue = {
	ORDER: 'order.queue' as const,
	PAYMENT: 'payment.queue' as const,
	NOTIFICATIONS: 'notifications.queue' as const,
} as const

/**
 * Events with routing keys and payload schemas
 */
export const event = {
	ORDER_CREATED: {
		key: 'order.created' as const,
		payload: z.object({
			orderId: z.string(),
			total: z.number(),
		}),
	},
	ORDER_FAILED: {
		key: 'order.failed' as const,
		payload: z.object({
			orderId: z.string(),
			reason: z.string(),
			code: z.string().optional(),
		}),
	},
	PAYMENT_SUCCEEDED: {
		key: 'payment.succeeded' as const,
		payload: z.object({
			paymentId: z.string(),
			orderId: z.string(),
			amount: z.number(),
			currency: z.string().length(3),
		}),
	},
	PAYMENT_FAILED: {
		key: 'payment.failed' as const,
		payload: z.object({
			paymentId: z.string(),
			orderId: z.string(),
			reason: z.string(),
			code: z.string().optional(),
		}),
	},
} as const

/**
 * Organized event payload types
 */
export type EventPayload = {
	OrderCreated: z.infer<typeof event.ORDER_CREATED.payload>
	OrderFailed: z.infer<typeof event.ORDER_FAILED.payload>
	PaymentSucceeded: z.infer<typeof event.PAYMENT_SUCCEEDED.payload>
	PaymentFailed: z.infer<typeof event.PAYMENT_FAILED.payload>
}

// Individual type exports
export type OrderCreated = EventPayload['OrderCreated']
export type OrderFailed = EventPayload['OrderFailed']
export type PaymentSucceeded = EventPayload['PaymentSucceeded']
export type PaymentFailed = EventPayload['PaymentFailed']
