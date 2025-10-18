import { z } from 'zod'

import { createOperatorFilterQuery } from '../filter-operators'
import { createIncludeQuery } from '../include'
import { createSelectQuery } from '../select'
import { createSortQuery } from '../sort'
import { paginationQuery } from './base'

/** Utility alias for any Zod object schema we accept as a relation. */
type AnyZodObject = z.ZodObject<z.ZodRawShape>

type BaseShape = typeof paginationQuery.shape

// Extract the raw shape type from a ZodObject
type ExtractShape<T> = T extends z.ZodObject<infer S> ? S : never

type PaginatedQueryShape<
	TSortable extends z.ZodObject<z.ZodRawShape> | undefined,
	TSelectable extends z.ZodObject<z.ZodRawShape> | undefined,
	TRelations extends Record<string, AnyZodObject> | undefined,
	TFilterable extends z.ZodObject<z.ZodRawShape> | undefined,
> = BaseShape &
	(TSortable extends z.ZodObject<z.ZodRawShape>
		? { sort: z.ZodOptional<ReturnType<typeof createSortQuery<ExtractShape<TSortable>>>> }
		: unknown) &
	(TSelectable extends z.ZodObject<z.ZodRawShape>
		? { select: z.ZodOptional<ReturnType<typeof createSelectQuery<ExtractShape<TSelectable>>>> }
		: unknown) &
	(TRelations extends Record<string, AnyZodObject>
		? { include: z.ZodOptional<ReturnType<typeof createIncludeQuery<TRelations>>> }
		: unknown) &
	(TFilterable extends z.ZodObject<z.ZodRawShape>
		? { filter: z.ZodOptional<ReturnType<typeof createOperatorFilterQuery<ExtractShape<TFilterable>>>> }
		: unknown)

/**
 * Creates a Zod query schema for offset-based pagination with optional helpers.
 */
export function createPaginatedQuery<
	TSortable extends z.ZodObject<z.ZodRawShape> | undefined = undefined,
	TSelectable extends z.ZodObject<z.ZodRawShape> | undefined = undefined,
	TRelations extends Record<string, AnyZodObject> | undefined = undefined,
	TFilterable extends z.ZodObject<z.ZodRawShape> | undefined = undefined,
>(options?: {
	sortable?: TSortable
	selectable?: TSelectable
	includable?: TRelations
	filterable?: TFilterable
}): z.ZodObject<PaginatedQueryShape<TSortable, TSelectable, TRelations, TFilterable>> {
	const { sortable, selectable, includable, filterable } = options ?? {}

	const shape = {
		...paginationQuery.shape,
		...(sortable ? { sort: createSortQuery(sortable).optional() } : {}),
		...(selectable ? { select: createSelectQuery(selectable).optional() } : {}),
		...(includable ? { include: createIncludeQuery(includable).optional() } : {}),
		...(filterable ? { filter: createOperatorFilterQuery(filterable).optional() } : {}),
	}

	return z.strictObject(shape) as z.ZodObject<PaginatedQueryShape<TSortable, TSelectable, TRelations, TFilterable>>
}
