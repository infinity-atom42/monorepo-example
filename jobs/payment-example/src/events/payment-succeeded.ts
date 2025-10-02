import type { EventHandler } from '@workspace/events'

/**
 * Event: Payment Succeeded
 * Handles successful payment events
 */

const event: EventHandler<'payments.succeeded'> = {
	eventName: 'payments.succeeded',
	handler: async (payload) => {
		console.log('💰 Processing payment succeeded event:', payload.paymentId)

		// Your business logic here
		// Example: Update order status, trigger fulfillment, etc.

		console.log(`✅ Payment ${payload.paymentId} processed successfully`)
	},
}

export default event
