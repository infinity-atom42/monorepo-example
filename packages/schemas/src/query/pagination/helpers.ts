import type { PaginationMeta } from './base'

/**
 * Frontend helper to calculate navigation state
 */
export function getPaginationHelpers(meta: PaginationMeta) {
	const totalPages = Math.ceil(meta.total / meta.limit)
	const hasNextPage = meta.page < totalPages
	const hasPreviousPage = meta.page > 1

	return {
		totalPages,
		hasNextPage,
		hasPreviousPage,
	}
}
