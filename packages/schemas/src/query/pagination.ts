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

/**
 * Creates a complete paginated response schema
 *
 * Supports both simple pagination and dynamic select/include queries.
 *
 * @param itemSchema - The base schema for list items
 * @param includableRelations - Optional relations that can be included in the response
 *
 * @example
 * // Simple pagination (fields are required)
 * export const listProductsResponse = createPaginatedResponse(productSchema)
 *
 * @example
 * // With select/include support (fields become optional)
 * const selectable = post.pick({ id: true, title: true, content: true })
 * const includable = { blog: blogSchema.pick({ id: true, name: true }) }
 * export const listPostsResponse = createPaginatedResponse(selectable, includable)
 */
export function createPaginatedResponse<
	TBase extends z.ZodObject<z.ZodRawShape>,
	TRelations extends Record<string, z.ZodObject<z.ZodRawShape>>
>(baseSchema: TBase, includableRelations?: TRelations) {
	// With relations or select support: extend and make partial
	if (includableRelations) {
		const extendedSchema = baseSchema.extend(includableRelations).partial()
		return z.object({
			data: z.array(extendedSchema),
			meta: paginationMeta,
		})
	}

	// Simple case: just base schema (keeps fields as-is for backward compatibility)
	return z.object({
		data: z.array(baseSchema),
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
