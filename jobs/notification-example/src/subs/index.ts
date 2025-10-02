/**
 * Sub Registry
 * Automatically imports and registers all subscribers
 */

import processFailed from './failed'

/**
 * List of all subscribers
 * Add new subscribers here
 */
export const subscribers: Array<Subscriber> = [processFailed]
