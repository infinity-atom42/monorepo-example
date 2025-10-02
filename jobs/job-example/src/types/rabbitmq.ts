/**
 * RabbitMQ Types - Single Source of Truth
 */

/**
 * Supported exchange types
 */
export const EXCHANGE_TYPES = {
	DIRECT: 'direct',
	TOPIC: 'topic',
	HEADERS: 'headers',
	FANOUT: 'fanout',
	MATCH: 'match',
} as const

export type ExchangeType = (typeof EXCHANGE_TYPES)[keyof typeof EXCHANGE_TYPES]

/**
* Event handler interface
* All event files must export a default EventHandler object
* 
* @example
* ```typescript
* // Export a typed EventHandler
* const event: EventHandler<OrderCreatedPayload> = {
*   eventName: 'order.created',
*   handler: async (payload) => {
*     // Your logic here
*   },
* }
* export default event
* ```
*/
export interface EventHandler<TPayload = unknown> {
	/** Unique event name (e.g., 'order.created') */
	readonly eventName: string
	/** Handler function to process the event */
	handler(payload: TPayload): Promise<void>
}
