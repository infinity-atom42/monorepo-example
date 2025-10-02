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

export const eventName = 'order.created'
export const queueName = 'order.created.queue'
export const routingKey = 'order.created'

export async function handler(payload: OrderCreatedPayload): Promise<void> {
	console.log('🛒 Processing order created event:', payload.orderId)

	// Your business logic here
	// Example: Send confirmation email, update inventory, etc.

	console.log(`✅ Order ${payload.orderId} processed successfully`)
}
