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
		// Base field select
		// select: ['id', 'title'],
		// include: {
		// 	blog: ['id', 'createdAt', 'updatedAt'],
		// },
		// sort: {
		// 	title: ['asc', 1],
		// 	createdAt: ['desc', 1],
		// 	updatedAt: ['asc', 2],
		// },
		filter: {
			blogId: {
				eq: '46633897-5768-4e72-9039-1858a4bd5bf5',
				in: ['46633897-5768-4e72-9039-1858a4bd5bf5'],
			},
			createdAt: {
				gte: '2024-01-01',
			},
			updatedAt: {
				lte: '2024-01-01',
			},
			published: {
				eq: true,
			},
		}
	},
})

if (error) {
	console.error(error)
} else {
	console.log(data)
}
