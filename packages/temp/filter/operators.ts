import { z } from 'zod'

/**
 * Creates operator-based filter query validator
 *
 * Supports comparison operators for more complex filtering.
 * Operators: eq, ne, gt, gte, lt, lte, in, nin, like, ilike
 * Multiple operators on the same field are AND-ed together.
 *
 * @param allowedFields - Zod object schema containing fields that can be filtered
 * @returns Zod object with filter validator
 *
 * @example
 * const filterableFields = post.pick({ published: true, authorId: true, createdAt: true })
 * export const listPostsQuery = z.object({
 *   ...paginationQuery.shape,
 *   filter: createOperatorFilterQuery(filterableFields).optional(),
 * })
 * // GET /posts?filter[published][eq]=true&filter[createdAt][gte]=2024-01-01
 */
export function createOperatorFilterQuery<T extends z.ZodRawShape>(
	allowedFields: z.ZodObject<T>,
) {
	const fieldNames = Object.keys(allowedFields.shape) as Array<keyof T & string>

	// Create operator schemas for each field type
	const filterFields = fieldNames.reduce(
		(acc, fieldName) => {
			const fieldSchema = allowedFields.shape[fieldName] as z.ZodTypeAny

			// Create operators object for this field
			acc[fieldName] = z
				.object({
					eq: fieldSchema.optional(),
					ne: fieldSchema.optional(),
					gt: fieldSchema.optional(),
					gte: fieldSchema.optional(),
					lt: fieldSchema.optional(),
					lte: fieldSchema.optional(),
					in: z.array(fieldSchema).optional(),
					nin: z.array(fieldSchema).optional(),
					// String-specific operators
					like: z.string().optional(),
					ilike: z.string().optional(),
				})
				.partial()
				.optional()

			return acc
		},
		{} as Record<string, z.ZodTypeAny>,
	)

	return z.object(filterFields).partial()
}

export type OperatorFilterQuery<T extends z.ZodRawShape> = z.infer<
	ReturnType<typeof createOperatorFilterQuery<T>>
>

/**
 * Available filter operators
 */
export const FILTER_OPERATORS = {
	eq: 'Equal to',
	ne: 'Not equal to',
	gt: 'Greater than',
	gte: 'Greater than or equal to',
	lt: 'Less than',
	lte: 'Less than or equal to',
	in: 'In array',
	nin: 'Not in array',
	like: 'SQL LIKE pattern match (case-sensitive)',
	ilike: 'SQL ILIKE pattern match (case-insensitive)',
} as const

export type FilterOperator = keyof typeof FILTER_OPERATORS
