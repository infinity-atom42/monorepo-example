/**
 * Event Registry
 * Automatically imports and registers all event handlers
 */

import type { EventHandler } from '../types/rabbitmq'
import orderCreated from './order-created'
import orderFailed from './order-failed'
import paymentSucceeded from './payment-succeeded'

/**
 * List of all event handlers
 * Add new event handlers here
 */
export const eventHandlers: Array<EventHandler> = [
	orderCreated,
	orderFailed,
	paymentSucceeded,
]