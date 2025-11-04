import { z } from 'zod'

/**
 * Cleanup Job
 *
 * Performs periodic cleanup tasks like removing old logs,
 * clearing expired sessions, etc.
 */

export const cleanupResult = z.object({
	timestamp: z.iso.datetime(),
	message: z.string(),
	itemsCleaned: z.number(),
})

export type CleanupResult = z.infer<typeof cleanupResult>

/**
 * Executes the cleanup job logic
 * Separated from cron registration for testability
 */
export function runCleanup(): CleanupResult {
	const timestamp = new Date().toISOString()

	// Simulate cleanup work (in real app, this would clean database, logs, etc.)
	const itemsCleaned = Math.floor(Math.random() * 10)

	const message = `[Cleanup] Cleaned ${itemsCleaned} items at ${timestamp}`

	// Log to console
	console.log(message)

	// Return result for testing/monitoring
	return {
		timestamp,
		message,
		itemsCleaned,
	}
}
