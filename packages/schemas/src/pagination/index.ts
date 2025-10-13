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
	page: z.number().min(1).default(1).optional(),
	limit: z.number().min(1).max(100).default(10).optional(),
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

/**
 * Creates a complete paginated response schema
 *
 * Wraps your data schema with pagination metadata.
 *
 * @example
 * export const listProductsResponse = createPaginatedResponse(productSchema)
 * // Server returns: { data: Product[], meta: { page, limit, total } }
 */
export function createPaginatedResponse<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		data: z.array(itemSchema),
		meta: paginationMeta,
	})
}

export type PaginationQuery = z.infer<typeof paginationQuery>
export type PaginationMeta = z.infer<typeof paginationMeta>

/**
 * Frontend helper to calculate navigation state
 *
 * Calculates totalPages and determines if next/previous pages exist.
 *
 * @example
 * const { totalPages, hasNextPage, hasPreviousPage } = getPaginationHelpers(meta)
 * // Use these to show/hide navigation buttons
 */
export function getPaginationHelpers(meta: PaginationMeta) {
	const totalPages = Math.ceil(meta.total / meta.limit)
	const hasNextPage = meta.page < totalPages
	const hasPreviousPage = meta.page > 1

	return {
		totalPages,
		hasNextPage,
		hasPreviousPage,
	}
}
