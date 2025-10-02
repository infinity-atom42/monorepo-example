import type { EventHandler } from '@workspace/events'

/**
 * Event: Payment Created
 * Handles newly created payment events
 */

const event: EventHandler<'payments.created'> = {
    eventName: 'payments.created',
    handler: async (payload) => {
        console.log('🧾 Processing payment created event:', payload.paymentId)

        // Add domain logic for initial payment record creation

        console.log(`✅ Payment ${payload.paymentId} created processed successfully`)
    },
}

export default event
