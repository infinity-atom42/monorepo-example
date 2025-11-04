import { z } from 'zod'

import { createSelectQuery } from './select'

/** Utility alias for any Zod object schema we accept as a relation. */
type AnyZodObject = z.ZodObject<z.ZodRawShape>

/** Extracts the raw shape from a Zod object, used to feed `createSelectQuery`. */
type ZodObjectShape<TSchema extends AnyZodObject> = TSchema extends z.ZodObject<infer Shape> ? Shape : never

type RelationSelectSchema<TSchema extends AnyZodObject> = ReturnType<typeof createSelectQuery<ZodObjectShape<TSchema>>>

/** Schema used to validate a single relation entry inside the include object. */
type IncludeFieldSchema<TSchema extends AnyZodObject> = z.ZodOptional<RelationSelectSchema<TSchema>>

/** Schema that maps every relation name to its include field schema. */
type IncludeSelectionSchema<TRelations extends Record<string, AnyZodObject>> = {
	[K in keyof TRelations]: IncludeFieldSchema<TRelations[K]>
}

type SelectKeys<TSchema extends AnyZodObject> = Extract<keyof ZodObjectShape<TSchema>, string>

/**
 * Runtime type for a single relation entry inside `include`.
 * Accepts a nested select array constrained to relation keys.
 */
export type IncludeRelationValue<TSchema extends AnyZodObject> = {
	select?: Array<SelectKeys<TSchema>>
}

/** Type representing the full include object keyed by relation names. */
export type IncludeSelection<TRelations extends Record<string, AnyZodObject>> = {
	[K in keyof TRelations]?: IncludeRelationValue<TRelations[K]>
}

/** Type describing the optional include field added to a query schema. */
export type IncludeQuery<TRelations extends Record<string, AnyZodObject>> = {
	include?: IncludeSelection<TRelations>
}

/**
 * Creates a Zod schema that validates relation include parameters.
 * Each relation can provide a nested select payload limited to the relation's fields.
 */
export function createIncludeQuery<TRelations extends Record<string, AnyZodObject>>(relations: TRelations) {
	const includeShape = {} as IncludeSelectionSchema<TRelations>

	for (const relationName of Object.keys(relations) as Array<keyof TRelations>) {
		const schema = relations[relationName]
		if (!schema) continue
		const selectQuery = createSelectQuery(schema) as RelationSelectSchema<TRelations[typeof relationName]>

		includeShape[relationName] = selectQuery.optional() as IncludeFieldSchema<TRelations[typeof relationName]>
	}

	return z.strictObject(includeShape).partial().describe('Relations to include in response')
}

/** Convenience alias for the Zod schema returned by `createIncludeQuery`. */
export type IncludeQuerySchema<TRelations extends Record<string, AnyZodObject>> = ReturnType<
	typeof createIncludeQuery<TRelations>
>

/**
 * Usage example:
 *
 * const includable = {
 * 	blog: blogSchema.pick({ id: true, name: true }),
 * }
 *
 * const includeQuery = createIncludeQuery(includable)
 *
 * export const listPostsQuery = z.object({
 * 	...paginationQuery.shape,
 * 	...includeQuery.shape,
 * })
 *
 * type ListPostsInclude = IncludeQuery<typeof includable>
 * // → client code gets autocomplete for include.blog.select with the blog fields above
 */
