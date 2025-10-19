import { asc, desc, type SQL } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'

type SortOrder = 'asc' | 'desc'
type SortConfig = {
	order: SortOrder
	index?: number
}
type SortConfiguration = Record<string, SortConfig | undefined>

interface BuildOrderByOptions<T extends Record<string, PgColumn>> {
	sort?: SortConfiguration | undefined
	columns: T
}

/**
 * Builds ORDER BY clause from sort configuration
 */
export function buildOrderByClause<T extends Record<string, PgColumn>>({
	sort,
	columns,
}: BuildOrderByOptions<T>): SQL[] {
	if (!sort) return []

	// Convert sort object to array of [field, config] and sort by index
	const sortEntries = Object.entries(sort)
		.filter(([, config]) => config !== undefined)
		.sort(([, a], [, b]) => (a?.index ?? 0) - (b?.index ?? 0))

	const orderByClause: SQL[] = []

	for (const [field, config] of sortEntries) {
		const column = columns[field as keyof T]
		if (!column || !config) continue

		if (config.order === 'asc') {
			orderByClause.push(asc(column))
		} else {
			orderByClause.push(desc(column))
		}
	}

	return orderByClause
}
