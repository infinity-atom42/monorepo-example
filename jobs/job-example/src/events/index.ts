/**
 * Event Registry
 * Automatically imports and registers all event handlers
 */

import * as orderCreated from './order-created'
import * as orderFailed from './order-failed'
import * as paymentSucceeded from './payment-succeeded'

export interface EventHandler<T = unknown> {
	eventName: string
	queueName: string
	routingKey: string
	handler: (payload: T) => Promise<void>
}

/**
 * List of all event handlers
 * Add new event handlers here
 */
export const eventHandlers: EventHandler<unknown>[] = [
	orderCreated as EventHandler<unknown>,
	orderFailed as EventHandler<unknown>,
	paymentSucceeded as EventHandler<unknown>,
]

/**
 * Get an event handler by name
 */
export function getEventHandler(
	eventName: string
): EventHandler<unknown> | undefined {
	return eventHandlers.find((handler) => handler.eventName === eventName)
}
