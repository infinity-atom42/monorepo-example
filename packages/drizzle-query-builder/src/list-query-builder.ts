import { count, getTableColumns, type SQL } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { PgSelect, PgTable } from 'drizzle-orm/pg-core'

import { buildOrderByClause } from './sort'
import { buildWhereClause, type FilterConfig } from './filter'
import { buildSelectWithInclude, type RelationInclude } from './select'

/**
 * Configuration for a relation that can be included in the query
 */
export interface RelationConfig {
	/** The key used in the include object (e.g., 'blog') */
	relationKey: string
	/** The related table */
	table: PgTable
	/** The join condition SQL */
	joinCondition: SQL
}

/**
 * Configuration for building a list query
 */
export interface ListQueryConfig<
	TMainTable extends PgTable,
	TSchema extends Record<string, unknown> = Record<string, never>
> {
	/** The Drizzle database instance */
	db: NodePgDatabase<TSchema>
	/** The main table to query */
	table: TMainTable
	/** 
	 * Array of field names that can be optionally selected.
	 * If not provided, field selection is disabled and all fields are always returned.
	 * When provided, fields NOT in this array are always included (required fields).
	 */
	selectableFields?: string[]
	/** Map of available relations that can be included */
	relations?: Record<string, RelationConfig>
}

/**
 * Options passed to the list query function
 */
export interface ListQueryOptions {
	page: number
	limit: number
	select?: string[] | undefined
	sort?: Record<string, { order: 'asc' | 'desc'; index: number } | undefined> | undefined
	filter?: FilterConfig | undefined
	include?: Record<string, string[] | undefined> | undefined
}

/**
 * Result of a list query
 */
export interface ListQueryResult<T> {
	data: T[]
	meta: {
		page: number
		limit: number
		total: number
	}
}

/**
 * Creates a generic list query function for a given table configuration
 * 
 * @example
 * ```typescript
 * const listPosts = createListQueryBuilder({
 *   db,
 *   table: posts,
 *   selectableFields: ['id', 'title', 'content', 'blogId'],
 *   relations: {
 *     blog: {
 *       relationKey: 'blog',
 *       table: blogs,
 *       joinCondition: eq(posts.blogId, blogs.id),
 *     },
 *   },
 * })
 * 
 * // Usage:
 * const result = await listPosts(query)
 * ```
 */
export function createListQueryBuilder<
	TMainTable extends PgTable,
	TSchema extends Record<string, unknown> = Record<string, never>
>(
	config: ListQueryConfig<TMainTable, TSchema>
) {
	return async function executeListQuery<TResult>(
		options: ListQueryOptions
	): Promise<ListQueryResult<TResult>> {
		const { page, limit, select, sort, filter, include } = options
		const offset = (page - 1) * limit

		const tableColumns = getTableColumns(config.table)

		// Build WHERE clause from filters
		const whereClause = buildWhereClause({
			filter,
			columns: tableColumns,
		})

		// Build ORDER BY clause from sort
		const orderByClause = buildOrderByClause({
			sort,
			columns: tableColumns,
		})

		// Build includes array
		const includes: RelationInclude[] = []
		const joinFlags: Record<string, boolean> = {}

		if (include && config.relations) {
			for (const [relationKey, fields] of Object.entries(include)) {
				// Filter out undefined values and check if fields array is not empty
				if (fields && Array.isArray(fields) && fields.length > 0 && config.relations[relationKey]) {
					const relationConfig = config.relations[relationKey]
					includes.push({
						relationKey,
						fields,
						relationTable: relationConfig.table,
					})
					joinFlags[relationKey] = true
				}
			}
		}

		// Build SELECT clause with includes
		const selectClause = buildSelectWithInclude({
			select: config.selectableFields ? select : undefined, // Disable select if selectableFields not configured
			mainColumns: tableColumns,
			...(config.selectableFields ? { selectableFields: config.selectableFields } : {}),
			includes,
		})

		// Build the base query with appropriate joins
		// Note: Drizzle's type system doesn't handle dynamic query building with generics well
		// When we add joins in a loop, the nullability map changes but TS can't track it
		// We use targeted type assertions that match Drizzle's actual runtime behavior
		let baseQuery = config.db.select(selectClause).from(config.table as PgTable)

		// Add joins for included relations
		if (config.relations) {
			for (const [relationKey, relationConfig] of Object.entries(config.relations)) {
				if (joinFlags[relationKey]) {
					// Type assertion needed: leftJoin changes the query's nullability map, incompatible with loop typing
					baseQuery = baseQuery.leftJoin(relationConfig.table, relationConfig.joinCondition) as unknown as typeof baseQuery
				}
			}
		}

		// Make the query dynamic to allow chaining where/orderBy/limit
		// Drizzle's .$dynamic() widens the type intentionally for runtime flexibility
		type DynamicQuery = PgSelect & {
			where: (condition: SQL) => DynamicQuery
			orderBy: (...columns: SQL[]) => DynamicQuery
			limit: (limit: number) => DynamicQuery
			offset: (offset: number) => DynamicQuery
		}
		
		let dynamicQuery = baseQuery.$dynamic() as unknown as DynamicQuery

		// Apply WHERE clause
		if (whereClause) {
			dynamicQuery = dynamicQuery.where(whereClause)
		}

		// Apply ORDER BY clause
		if (orderByClause.length > 0) {
			dynamicQuery = dynamicQuery.orderBy(...orderByClause)
		}

		// Apply pagination
		dynamicQuery = dynamicQuery.limit(limit).offset(offset)

		// Execute query
		const data = await dynamicQuery

		// Get total count with the same WHERE clause
		const countQueryBuilder = config.db.select({ count: count() }).from(config.table as PgTable).$dynamic()
		
		const countResult = await (whereClause 
			? countQueryBuilder.where(whereClause) 
			: countQueryBuilder
		)

		const total = countResult[0]?.count ?? 0

		return {
			data: data as TResult[],
			meta: {
				page,
				limit,
				total,
			},
		}
	}
}
