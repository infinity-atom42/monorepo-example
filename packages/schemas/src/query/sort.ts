import { z } from 'zod'

/**
 * Sorting helpers
 * - createSortQuery(allowed): Adds `sort` object to a query schema
 * - New shape: exactly ONE allowed field must be provided, whose value is an
 *   object with `{ order: 'asc' | 'desc', index: number }`.
 * - Example URL: ?sort[createdAt][order]=desc&sort[createdAt][index]=1
 * - Default: `sort` can be omitted entirely
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
	const SortSpec = z.strictObject({
		order: Order,
		index: z.number().int().gte(0),
	})

	const sortShape = Object.keys(allowedFields.shape).reduce(
		(acc, key) => {
			acc[key as keyof T] = SortSpec
			return acc
		},
		{} as { [K in keyof T]: typeof SortSpec }
	)

	return z
		.strictObject(sortShape)
		.partial() // all field keys optional at the top-level
}

export type SortQuery<T extends z.ZodRawShape> = z.infer<ReturnType<typeof createSortQuery<T>>>
