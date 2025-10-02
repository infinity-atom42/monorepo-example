/**
 * Sub Registry
 * Automatically imports and registers all subscribers
 */

import paymentSucceeded from './payment-succeeded'
import paymentCreated from './payment-created'

/**
 * List of all subscribers
 * Add new subscribers here
 */
export const subscribers: Array<Subscriber> = [paymentCreated, paymentSucceeded]
