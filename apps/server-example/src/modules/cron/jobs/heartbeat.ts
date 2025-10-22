import { z } from 'zod'

/**
 * Heartbeat Job
 *
 * Simple health check job that logs a timestamp periodically
 * to verify the cron system is working.
 */

export const heartbeatResult = z.object({
	timestamp: z.iso.datetime(),
	message: z.string(),
})

export type HeartbeatResult = z.infer<typeof heartbeatResult>

/**
 * Executes the heartbeat job logic
 * Separated from cron registration for testability
 */
export function runHeartbeat(): HeartbeatResult {
	const timestamp = new Date().toISOString()
	const message = `[Heartbeat] Server is alive at ${timestamp}`

	// Log to console
	console.log(message)

	// Return result for testing/monitoring
	return {
		timestamp,
		message,
	}
}
