/**
 * Sub Registry
 * Automatically imports and registers all subscribers
 */

import orderCreated from './created'
import orderFailed from './failed'

/**
 * List of all subscribers
 * Add new subscribers here
 */
export const subscribers: Array<Subscriber> = [orderCreated, orderFailed]
