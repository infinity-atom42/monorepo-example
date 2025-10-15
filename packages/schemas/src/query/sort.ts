import { z } from 'zod'

/**
 * Sorting helpers
 * - createSortQuery(allowed): Adds `sort` array to a query schema
 * - URL: ?sort[0][field]=createdAt&sort[0][order]=desc&sort[1][field]=title&sort[1][order]=asc
 * - Type: Array<{ field: keyof allowed; order: 'asc' | 'desc' }>
 * - Default: [] so servers can fallback (e.g., by id) when sort is omitted
 *
 * Example:
 *   const sortable = post.pick({ title: true, createdAt: true, updatedAt: true })
 *   export const listPostsQuery = z.object({
 *     ...paginationQuery.shape,
 *     ...createSortQuery(sortable).shape,
 *   })
 */
export function createSortQuery<T extends z.ZodRawShape>(allowedFields: z.ZodObject<T>) {
	const Order = z.enum(['asc', 'desc'])

	return z.object({
		sort: z
			.array(
				z.object({
					field: allowedFields.keyof(),
					order: Order,
				}),
			)
			.optional()
	})
}

export type SortQuery<T extends z.ZodRawShape> = z.infer<
	ReturnType<typeof createSortQuery<T>>
>