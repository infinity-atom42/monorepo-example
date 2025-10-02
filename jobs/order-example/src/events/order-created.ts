import type { EventHandler } from '@workspace/events'

/**
 * Event: Order Created
 * Handles order creation events
 */

const event: EventHandler<'orders.created'> = {
	eventName: 'orders.created',
	handler: async (payload) => {
		console.log('🛒 Processing order created event:', payload.orderId)

		// Your business logic here
		// Example: Send confirmation email, update inventory, etc.

		console.log(`✅ Order ${payload.orderId} processed successfully`)
	},
}

export default event
