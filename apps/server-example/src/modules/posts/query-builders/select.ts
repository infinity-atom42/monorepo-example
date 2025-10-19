import { getTableColumns } from 'drizzle-orm'
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core'

interface BuildSelectOptions<T extends Record<string, PgColumn>> {
	select?: string[] | undefined
	columns: T
}

interface BuildSelectWithIncludeOptions<TMainColumns extends Record<string, PgColumn>> {
	select?: string[] | undefined
	mainColumns: TMainColumns
	selectableFields?: string[]
	include?:
		| {
				relationKey: string
				fields: string[]
				relationTable: PgTable
		  }
		| undefined
}

/**
 * Builds SELECT clause from select configuration
 */
export function buildSelectClause<T extends Record<string, PgColumn>>({
	select,
	columns,
}: BuildSelectOptions<T>): Record<string, PgColumn> {
	const selectClause: Record<string, PgColumn> = {}

	if (select && select.length > 0) {
		// Select only specified fields
		for (const field of select) {
			const column = columns[field as keyof T]
			if (column) {
				selectClause[field] = column
			}
		}
	} else {
		// Select all fields
		return { ...columns }
	}

	return selectClause
}

/**
 * Builds SELECT clause with relation includes
 */
export function buildSelectWithInclude<TMainColumns extends Record<string, PgColumn>>({
	select,
	mainColumns,
	selectableFields,
	include,
}: BuildSelectWithIncludeOptions<TMainColumns>): Record<string, PgColumn | Record<string, PgColumn>> {
	let selectClause: Record<string, PgColumn | Record<string, PgColumn>> = {}

	// Build main select clause
	if (select && select.length > 0) {
		// First, add all required fields (fields NOT in selectableFields)
		for (const [fieldName, column] of Object.entries(mainColumns)) {
			if (!selectableFields || !selectableFields.includes(fieldName)) {
				selectClause[fieldName] = column
			}
		}

		// Then, add selected fields
		for (const field of select) {
			const column = mainColumns[field as keyof TMainColumns]
			if (column) {
				selectClause[field] = column
			}
		}
	} else {
		// Select all main fields
		selectClause = { ...mainColumns }
	}

	// Add relation fields if specified
	if (include && include.fields.length > 0) {
		const relationColumns = getTableColumns(include.relationTable)
		const relationSelectClause: Record<string, PgColumn> = {}

		for (const field of include.fields) {
			const column = relationColumns[field as keyof typeof relationColumns]
			if (column) {
				relationSelectClause[field] = column
			}
		}

		selectClause[include.relationKey] = relationSelectClause
	}

	return selectClause
}
