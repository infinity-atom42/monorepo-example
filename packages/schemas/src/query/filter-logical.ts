import { z } from 'zod'

// ! Disclaimer: This code is not fully typesafe
// TODO: test this code

/**
 * Creates logical combinator filter query validator
 *
 * Supports complex filtering with logical operators (and, or, not) and nesting.
 * Can combine simple equality filters, operator filters, and logical combinators.
 *
 * @param allowedFields - Zod object schema containing fields that can be filtered
 * @returns Zod filter validator with logical combinators
 *
 * @example
 * const filterableFields = post.pick({ published: true, authorId: true })
 * export const listPostsQuery = z.object({
 *   ...paginationQuery.shape,
 *   filter: createLogicalFilterQuery(filterableFields).optional(),
 * })
 * // Complex query: (published=true AND (authorId=123 OR authorId=456))
 */
export function createLogicalFilterQuery<T extends z.ZodRawShape>(
	allowedFields: z.ZodObject<T>,
) {
	const fieldNames = Object.keys(allowedFields.shape) as Array<keyof T & string>

	// Create operator schemas for each field
	const operatorFields = fieldNames.reduce(
		(acc, fieldName) => {
			const fieldSchema = allowedFields.shape[fieldName] as z.ZodTypeAny

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
					like: z.string().optional(),
					ilike: z.string().optional(),
				})
				.partial()

			return acc
		},
		{} as Record<string, z.ZodTypeAny>,
	)

	// Create simple equality fields
	const simpleFields = fieldNames.reduce(
		(acc, fieldName) => {
			const fieldSchema = allowedFields.shape[fieldName] as z.ZodTypeAny
			acc[fieldName] = fieldSchema
			return acc
		},
		{} as Record<string, z.ZodTypeAny>,
	)

	// Base condition can be either simple fields or operator fields
	const baseCondition: z.ZodTypeAny = z.union([
		z.object(simpleFields).partial(),
		z.object(operatorFields).partial(),
	])

	// Create the recursive schema using z.lazy
	const logicalFilter: z.ZodTypeAny = z.lazy(() =>
		z
			.object({
				and: z.array(z.union([baseCondition, logicalFilter])).optional(),
				or: z.array(z.union([baseCondition, logicalFilter])).optional(),
				not: z.union([baseCondition, logicalFilter]).optional(),
			})
			.partial(),
	)

	// Final filter can be a base condition or a logical combinator
	return z.union([baseCondition, logicalFilter])
}

export type LogicalFilterQuery<T extends z.ZodRawShape> = z.infer<
	ReturnType<typeof createLogicalFilterQuery<T>>
>

/**
 * Type guard to check if a filter uses logical operators
 */
export function isLogicalFilter(filter: unknown): filter is {
	and?: unknown[]
	or?: unknown[]
	not?: unknown
} {
	return (
		filter !== null &&
		typeof filter === 'object' &&
		('and' in filter || 'or' in filter || 'not' in filter)
	)
}

/**
 * Type guard to check if a field value uses operators
 */
export function isOperatorFilter(value: unknown): value is Record<string, unknown> {
	if (!value || typeof value !== 'object') return false

	const operators = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'like', 'ilike']
	return Object.keys(value).some((key) => operators.includes(key))
}
