import { getTableColumns } from 'drizzle-orm'
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core'

interface BuildSelectOptions<T extends Record<string, PgColumn>> {
	select?: string[] | undefined
	columns: T
	selectableFields?: string[]
}

export interface RelationInclude {
	relationKey: string
	fields: string[]
	relationTable: PgTable
}

interface BuildSelectWithIncludeOptions<TMainColumns extends Record<string, PgColumn>> {
	select?: string[] | undefined
	mainColumns: TMainColumns
	selectableFields?: string[]
	includes?: RelationInclude[]
}

/**
 * Builds SELECT clause from select configuration
 * @param select - Array of field names to select (if undefined, selects all)
 * @param columns - All available columns
 * @param selectableFields - Fields that can be optionally selected (fields NOT in this list are always included)
 */
export function buildSelectClause<T extends Record<string, PgColumn>>({
	select,
	columns,
	selectableFields,
}: BuildSelectOptions<T>): Record<string, PgColumn> {
	const selectClause: Record<string, PgColumn> = {}

	if (select && select.length > 0) {
		// First, add all required fields (fields NOT in selectableFields)
		if (selectableFields) {
			for (const [fieldName, column] of Object.entries(columns)) {
				if (!selectableFields.includes(fieldName)) {
					selectClause[fieldName] = column
				}
			}
		}

		// Then, add selected fields
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
 * @param select - Array of field names to select from main table
 * @param mainColumns - All available columns from main table
 * @param selectableFields - Fields that can be optionally selected (fields NOT in this list are always included)
 * @param includes - Array of relations to include (e.g., [{blog}, {user}])
 */
export function buildSelectWithInclude<TMainColumns extends Record<string, PgColumn>>({
	select,
	mainColumns,
	selectableFields,
	includes,
}: BuildSelectWithIncludeOptions<TMainColumns>): Record<string, PgColumn | Record<string, PgColumn>> {
	// Build main select clause using the core function
	const selectClause = buildSelectClause({
		select,
		columns: mainColumns,
		...(selectableFields ? { selectableFields } : {}),
	}) as Record<string, PgColumn | Record<string, PgColumn>>

	// Add relation fields if specified
	if (includes && includes.length > 0) {
		for (const include of includes) {
			if (include.fields.length > 0) {
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
		}
	}

	return selectClause
}
