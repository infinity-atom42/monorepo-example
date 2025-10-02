/**
 * Event Registry
 * Automatically imports and registers all event handlers
 */

import type { EventHandler } from '@workspace/events'

import paymentSucceeded from './payment-succeeded'
import paymentCreated from './payment-created'

/**
 * List of all event handlers
 * Add new event handlers here
 */
export const eventHandlers: Array<EventHandler> = [paymentCreated, paymentSucceeded]
