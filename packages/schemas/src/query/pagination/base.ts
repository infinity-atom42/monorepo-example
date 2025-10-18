import { z } from 'zod'

/**
 * Query parameters for offset-based pagination
 *
 * Use this to extend your API query schemas with pagination support.
 *
 * @example
 * export const listProductsQuery = z.object({
 *   ...paginationQuery.shape,
 *   category: z.string().optional(),
 * })
 * // GET /products?page=2&limit=20&category=electronics
 */
export const paginationQuery = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
})

/**
 * Metadata returned by server in paginated responses
 *
 * Server sends these values, client calculates derived values using getPaginationHelpers().
 *
 * @example
 * { page: 2, limit: 20, total: 100 }
 */
export const paginationMeta = z.object({
	page: z.number().min(1),
	limit: z.number().min(1),
	total: z.number().min(0),
})

export type PaginationQuery = z.infer<typeof paginationQuery>
export type PaginationMeta = z.infer<typeof paginationMeta>
