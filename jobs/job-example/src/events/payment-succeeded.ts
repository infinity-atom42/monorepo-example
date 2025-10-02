/**
 * Event: Payment Succeeded
 * Handles successful payment events
 */

interface PaymentSucceededPayload {
	paymentId: string
	orderId: string
	userId: string
	amount: number
	currency: string
	method: string
	timestamp: string
}

export const eventName = 'payment.succeeded'
export const queueName = 'payment.succeeded.queue'
export const routingKey = 'payment.succeeded'

export async function handler(payload: PaymentSucceededPayload): Promise<void> {
	console.log('💰 Processing payment succeeded event:', payload.paymentId)

	// Your business logic here
	// Example: Update order status, trigger fulfillment, etc.

	console.log(`✅ Payment ${payload.paymentId} processed successfully`)
}
