import { z } from 'zod'

/**
 * Creates a simple equality filter query validator
 *
 * Supports basic equality filtering where all conditions are AND-ed together.
 * Only fields explicitly provided in allowedFields are permitted (opt-in security model).
 *
 * @param allowedFields - Zod object schema containing fields that can be filtered
 * @returns Zod object with filter fields (all optional)
 *
 * @example
 * const filterableFields = post.pick({ published: true, authorId: true })
 * export const listPostsQuery = z.object({
 *   ...paginationQuery.shape,
 *   ...createSimpleFilterQuery(filterableFields).shape,
 * })
 * // GET /posts?published=true&authorId=123
 */
export function createSimpleFilterQuery<T extends z.ZodRawShape>(allowedFields: z.ZodObject<T>) {
	return z.array(allowedFields.keyof()).describe('Fields to filter by')
}

export type SimpleFilterQuery<T extends z.ZodRawShape> = z.infer<ReturnType<typeof createSimpleFilterQuery<T>>>
