import { z } from 'zod'

/**
 * Event routing keys for message bus
 * 
 * @example
 * await publishEvent(ORDER_CREATED, { orderId: '123', total: 100 })
 */
export const ORDER_CREATED = 'order.created' as const
export const ORDER_FAILED = 'order.failed' as const
export const PAYMENT_SUCCEEDED = 'payment.succeeded' as const
export const PAYMENT_FAILED = 'payment.failed' as const

/**
 * Order domain event schemas
 */
export const OrderCreatedSchema = z.object({
	orderId: z.string(),
	total: z.number(),
})

export const OrderFailedSchema = z.object({
	orderId: z.string(),
	reason: z.string(),
	code: z.string().optional(),
})

/**
 * Payment domain event schemas
 */
export const PaymentSucceededSchema = z.object({
	paymentId: z.string(),
	orderId: z.string(),
	amount: z.number(),
	currency: z.string().length(3),
})

export const PaymentFailedSchema = z.object({
	paymentId: z.string(),
	orderId: z.string(),
	reason: z.string(),
	code: z.string().optional(),
})

export type OrderCreated = z.infer<typeof OrderCreatedSchema>
export type OrderFailed = z.infer<typeof OrderFailedSchema>
export type PaymentSucceeded = z.infer<typeof PaymentSucceededSchema>
export type PaymentFailed = z.infer<typeof PaymentFailedSchema>
