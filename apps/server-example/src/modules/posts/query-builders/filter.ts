import { and, eq, gt, gte, ilike, inArray, like, lt, lte, ne, not, type SQL } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'

export type FilterValue = string | number | boolean | string[] | number[] | boolean[]
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'ilike'
export type FieldFilter = Partial<Record<FilterOperator, FilterValue>>
export type FilterConfig = Record<string, FieldFilter | undefined>

interface BuildWhereOptions<T extends Record<string, PgColumn>> {
	filter?: FilterConfig | undefined
	columns: T
}

/**
 * Builds WHERE conditions from filter configuration
 */
export function buildWhereClause<T extends Record<string, PgColumn>>({
	filter,
	columns,
}: BuildWhereOptions<T>): SQL | undefined {
	if (!filter) return undefined

	const whereConditions: SQL[] = []

	for (const [field, operators] of Object.entries(filter)) {
		if (!operators) continue

		const column = columns[field as keyof T]
		if (!column) continue

		for (const [operator, value] of Object.entries(operators)) {
			if (value === undefined) continue

			switch (operator as FilterOperator) {
				case 'eq':
					whereConditions.push(eq(column, value))
					break
				case 'ne':
					whereConditions.push(ne(column, value))
					break
				case 'gt':
					whereConditions.push(gt(column, value))
					break
				case 'gte':
					whereConditions.push(gte(column, value))
					break
				case 'lt':
					whereConditions.push(lt(column, value))
					break
				case 'lte':
					whereConditions.push(lte(column, value))
					break
				case 'in':
					if (Array.isArray(value)) {
						whereConditions.push(inArray(column, value))
					}
					break
				case 'nin':
					if (Array.isArray(value)) {
						whereConditions.push(not(inArray(column, value)))
					}
					break
				case 'like':
					whereConditions.push(like(column, value as string))
					break
				case 'ilike':
					whereConditions.push(ilike(column, value as string))
					break
			}
		}
	}

	return whereConditions.length > 0 ? and(...whereConditions) : undefined
}
