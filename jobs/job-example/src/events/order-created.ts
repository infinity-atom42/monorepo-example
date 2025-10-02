import type { EventHandler } from '../types/rabbitmq'

/**
 * Event: Order Created
 * Handles order creation events
 */

interface OrderCreatedPayload {
	orderId: string
	userId: string
	amount: number
	items: Array<{ productId: string; quantity: number; price: number }>
	createdAt: string
}

const event: EventHandler<OrderCreatedPayload> = {
	eventName: 'order.created',
	handler: async (payload: OrderCreatedPayload) => {
		console.log('🛒 Processing order created event:', payload.orderId)

		// Your business logic here
		// Example: Send confirmation email, update inventory, etc.

		console.log(`✅ Order ${payload.orderId} processed successfully`)
	},
}

export default event
