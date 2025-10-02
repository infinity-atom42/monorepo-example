/**
 * Event: Order Failed
 * Handles order failure events
 */

interface OrderFailedPayload {
	orderId: string
	userId: string
	reason: string
	errorCode: string
	timestamp: string
}

export const eventName = 'order.failed'
export const queueName = 'order.failed.queue'
export const routingKey = 'order.failed'

export async function handler(payload: OrderFailedPayload): Promise<void> {
	console.log('⚠️ Processing order failed event:', payload.orderId)

	// Your business logic here
	// Example: Send notification to user, log to monitoring system, etc.

	console.log(`✅ Order failure ${payload.orderId} processed successfully`)
}
