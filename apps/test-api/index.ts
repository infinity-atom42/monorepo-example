import { treaty } from '@elysiajs/eden'
import type { App } from '@se/server'

export const example = treaty<App>('http://localhost:3101', {
	fetch: {
		credentials: 'include',
	},
})

// ✅ Type inference now works! All fields have autocomplete and type checking
const { data, error} = await example.v1.posts.get({
	query: {
		// Pagination (from paginationQuery)
		page: 1,
		limit: 10,
		select: [],
		include: {
			blog: ['id', 'createdAt', 'updatedAt'],
		},
		sort: {
			title: ['asc', 0],
			createdAt: ['desc', 1],
			updatedAt: ['asc', 2],
		},
		filter: [
			'blogId',
			'createdAt',
			'updatedAt',
			'published',
		],
		// filterOperators: {
		// 	blogId: {
		// 		eq: '46633897-5768-4e72-9039-1858a4bd5bf5',
		// 		in: ['46633897-5768-4e72-9039-1858a4bd5bf5'],
		// 	},
		// 	createdAt: {
		// 		gte: new Date('2024-01-01'),
		// 	},
		// 	published: {
		// 		eq: true,
		// 	},
		// }
	},
})

if (error) {
	console.error(error)
} else {
	console.log(data)
}

// --- Examples: Logical and Simple Filters ---

/**
 * Example: Logical filter (@filter-logical.ts)
 * Works when the server uses createLogicalFilterQuery for `filter`.
 */
/*
const { data: logicalData, error: logicalError } = await example.v1.posts.get({
	query: {
		page: 1,
		limit: 10,
		filter: {
			and: [
				{ published: { eq: true } }, // or { published: true }
				{
					or: [
						{ blogId: { eq: '46633897-5768-4e72-9039-1858a4bd5bf5' } },
						{ blogId: { in: ['46633897-5768-4e72-9039-1858a4bd5bf5', 'another-id'] } },
					],
				},
				{ not: { createdAt: { lt: '2024-01-01' } } },
			],
		},
	},
})

if (logicalError) {
	console.error(logicalError)
} else {
	console.log(logicalData)
}
*/

/**
 * Example: Simple equality filter (@filter.ts)
 * Works when the server uses createSimpleFilterQuery and exposes fields at top-level.
 */
/*
const { data: simpleData, error: simpleError } = await example.v1.posts.get({
	query: {
		page: 1,
		limit: 10,
		// Simple equality filters at the top level (no `filter` object)
		published: true,
		blogId: '46633897-5768-4e72-9039-1858a4bd5bf5',
		// You can also pass createdAt/updatedAt if allowed by the API
		// createdAt: '2024-01-01',
	},
})

if (simpleError) {
	console.error(simpleError)
} else {
	console.log(simpleData)
}
*/
