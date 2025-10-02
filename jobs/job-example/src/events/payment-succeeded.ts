import type { EventHandler } from '../types/rabbitmq'

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

const event: EventHandler<PaymentSucceededPayload> = {
	eventName: 'payment.succeeded',
	handler: async (payload: PaymentSucceededPayload) => {
		console.log('💰 Processing payment succeeded event:', payload.paymentId)

		// Your business logic here
		// Example: Update order status, trigger fulfillment, etc.

		console.log(`✅ Payment ${payload.paymentId} processed successfully`)
	},
}

export default event
