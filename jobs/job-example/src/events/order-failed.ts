import type { EventHandler } from '../types/rabbitmq'

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

const event: EventHandler<OrderFailedPayload> = {
	eventName: 'order.failed',
	handler: async (payload: OrderFailedPayload) => {
		console.log('⚠️ Processing order failed event:', payload.orderId)

		// Your business logic here
		// Example: Send notification to user, log to monitoring system, etc.

		console.log(`✅ Order failure ${payload.orderId} processed successfully`)
	},
}
export default event
