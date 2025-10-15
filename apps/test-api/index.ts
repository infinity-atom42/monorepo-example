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
		// 	blog: {
		// 		select: ['id', 'name'],
		// 	},
		// },
		// sort: [
			// { field: 'createdAt', order: 'desc' },
			// { field: 'title', order: 'asc' },
		// ],
	},
})

if (error) {
	console.error(error)
} else {
	console.log(data)
}
