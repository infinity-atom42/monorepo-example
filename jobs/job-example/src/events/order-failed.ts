import type { EventHandler } from '@workspace/events'

/**
 * Event: Order Failed
 * Handles order failure events
 */

const event: EventHandler<'orders.failed'> = {
	eventName: 'orders.failed',
	handler: async (payload) => {
		console.log('⚠️ Processing order failed event:', payload.orderId)

		// Your business logic here
		// Example: Send notification to user, log to monitoring system, etc.

		console.log(`✅ Order failure ${payload.orderId} processed successfully`)
	},
}
export default event
