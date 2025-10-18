import { z } from 'zod'

// ! Disclaimer: This code is not fully typesafe but it is validated correctly

// Helper TypeScript types to provide strong inference for the filter object
type FieldOperatorOutput<TField extends z.ZodTypeAny> = Partial<{
	eq: z.infer<TField>
	ne: z.infer<TField>
	gt: z.infer<TField>
	gte: z.infer<TField>
	lt: z.infer<TField>
	lte: z.infer<TField>
	in: Array<z.infer<TField>>
	nin: Array<z.infer<TField>>
	like: string
	ilike: string
}>

export type OperatorFilterOutput<T extends z.ZodRawShape> = {
	[K in keyof T]?: FieldOperatorOutput<Extract<T[K], z.ZodTypeAny>>
}

/**
 * Build an operator object schema for a single field type
 */
export function createFieldOperatorSchema<TField extends z.ZodTypeAny>(fieldSchema: TField) {
	return z
		.strictObject({
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
}

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
export function createOperatorFilterQuery<T extends z.ZodRawShape>(allowedFields: z.ZodObject<T>) {
	const fieldNames = Object.keys(allowedFields.shape) as Array<keyof T & string>

	// Build the runtime Zod shape (kept permissive to avoid generic constraints issues)
	const filterFields: Record<string, z.ZodTypeAny> = {}

	for (const fieldName of fieldNames) {
		const fieldSchema = allowedFields.shape[fieldName] as unknown as z.ZodTypeAny
		const operatorSchema = createFieldOperatorSchema(fieldSchema)
		filterFields[fieldName] = operatorSchema.optional()
	}

	// Cast the return type so `z.infer` produces a strongly typed mapping
	return z.strictObject(filterFields).partial() as unknown as z.ZodType<OperatorFilterOutput<T>>
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
