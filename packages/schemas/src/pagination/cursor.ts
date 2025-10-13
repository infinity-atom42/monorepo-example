import { z } from 'zod'

/**
 * Query parameters for cursor-based pagination
 *
 * Use this to extend your API query schemas with cursor pagination support.
 * Best for: Large datasets, infinite scroll, real-time feeds.
 *
 * @example
 * export const listActivityQuery = z.object({
 *   ...cursorPaginationQuery.shape,
 *   type: z.string().optional(),
 * })
 * // First page: GET /activity?limit=10
 * // Next page: GET /activity?cursor=abc123&order=asc&limit=10
 *
 * // Note: Cursor is EXCLUSIVE (WHERE id > cursor, not >=)
 */
export const cursorPaginationQuery = z.object({
	cursor: z.string().optional(),
	order: z.enum(['asc', 'desc']).default('asc').optional(),
	limit: z.number().min(1).max(100).default(10).optional(),
})

/**
 * Metadata returned by server in cursor-paginated responses
 *
 * Server determines if more pages exist based on data availability.
 *
 * @example
 * { limit: 10, hasNextPage: true, hasPreviousPage: false }
 */
export const cursorPaginationMeta = z.object({
	limit: z.number().min(1),
	hasNextPage: z.boolean(),
	hasPreviousPage: z.boolean(),
})

/**
 * Creates a complete cursor-paginated response schema
 *
 * Wraps your data schema with cursor pagination metadata.
 * Client extracts cursor values directly from data items.
 *
 * @example
 * export const listActivityResponse = createCursorPaginatedResponse(activitySchema)
 * // Server returns: { data: Activity[], meta: { limit, hasNextPage, hasPreviousPage } }
 *
 * // Client usage:
 * const lastCursor = data.at(-1)?.id
 * if (meta.hasNextPage) fetchNext({ cursor: lastCursor, order: 'asc', limit: 10 })
 */
export function createCursorPaginatedResponse<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		data: z.array(itemSchema),
		meta: cursorPaginationMeta,
	})
}

export type CursorPaginationQuery = z.infer<typeof cursorPaginationQuery>
export type CursorPaginationMeta = z.infer<typeof cursorPaginationMeta>
