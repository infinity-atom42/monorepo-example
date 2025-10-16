import { z } from 'zod'

/**
 * Sorting helpers
 * - createSortQuery(allowed): Adds `sort` object to a query schema
 * - URL: ?sort[createdAt]=desc&sort[title]=asc
 * - Type: Partial<Record<keyof allowed, 'asc' | 'desc'>>
 * - Default: {} so servers can fallback (e.g., by id) when sort is omitted
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
	const OrderWithIndex = z.tuple([Order, z.number().int().gte(0)])
	const SortValue = z.union([Order, OrderWithIndex])
	const sortShape = Object.keys(allowedFields.shape).reduce(
		(acc, key) => {
			acc[key as keyof T] = SortValue
			return acc
		},
		{} as { [K in keyof T]: typeof SortValue },
	)

	return z.object({
		sort: z.strictObject(sortShape).partial().optional(),
	})
}

export type SortQuery<T extends z.ZodRawShape> = z.infer<
	ReturnType<typeof createSortQuery<T>>
>