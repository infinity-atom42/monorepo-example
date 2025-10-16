import { z } from 'zod'
import { createFieldOperatorSchema } from './filter-operators'

// ! Disclaimer: This code is not fully typesafe but it is validated correctly
// ! Disclaimer: This code was not tested

/**
 * Creates a logical filter query validator supporting nested AND/OR/NOT nodes.
 *
 * Leaf nodes are field condition objects where each allowed field can accept either:
 * - An operator object (eq, ne, gt, gte, lt, lte, in, nin, like, ilike)
 * - A direct value shorthand (interpreted as eq)
 *
 * Multiple fields in the same object are implicitly AND-ed.
 *
 * @param allowedFields - Zod object schema containing fields that can be filtered
 * @returns Zod schema for a recursive logical filter
 *
 * @example
 * const filterableFields = post.pick({ published: true, authorId: true, createdAt: true })
 * export const listPostsQuery = z.object({
 *   filterLogical: createLogicalFilterQuery(filterableFields).optional(),
 * })
 */
export function createLogicalFilterQuery<T extends z.ZodRawShape>(
    allowedFields: z.ZodObject<T>,
) {
    const fieldNames = Object.keys(allowedFields.shape) as Array<keyof T & string>

    // Build operator object for a single field based on its schema (reused)
    const buildOperatorObject = (fieldSchema: z.ZodTypeAny) => createFieldOperatorSchema(fieldSchema)

    // Field conditions object: { [field]: operatorObject | directValue }
    const fieldConditionsShape = fieldNames.reduce(
        (acc, fieldName) => {
            const fieldSchema = allowedFields.shape[fieldName] as z.ZodTypeAny
            acc[fieldName] = z.union([buildOperatorObject(fieldSchema), fieldSchema]).optional()
            return acc
        },
        {} as Record<string, z.ZodTypeAny>,
    )

    const fieldConditions = z.strictObject(fieldConditionsShape).partial()

    // Recursive logical node
    const node: z.ZodTypeAny = z.lazy(() =>
        z.union([
            fieldConditions,
            z.strictObject({ and: z.array(node).nonempty() }),
            z.strictObject({ or: z.array(node).nonempty() }),
            z.strictObject({ not: node }),
        ]),
    )

    return node
}

export type LogicalFilterQuery<T extends z.ZodRawShape> = z.infer<
    ReturnType<typeof createLogicalFilterQuery<T>>
>

export const LOGICAL_OPERATORS = {
    and: 'Logical AND',
    or: 'Logical OR',
    not: 'Logical NOT',
} as const
