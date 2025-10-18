import { treaty } from '@elysiajs/eden'
import type { App } from '@se/server'

export const example = treaty<App>('http://localhost:3101', {
	fetch: {
		credentials: 'include',
	},
})

// ✅ Type inference now works! All fields have autocomplete and type checking
const { data, error } = await example.v1.posts.get({
	query: {
		// Pagination (from paginationQuery)
		page: 1,
		limit: 10,
		select: ['content'],
		include: {
			blog: ['id'],
		},
		// sort: {
		// 	createdAt: { order: 'desc', index: 1 },
		// },
		filter: {
			blogId: {
				eq: '46633897-5768-4e72-9039-1858a4bd5bf5',
				in: ['46633897-5768-4e72-9039-1858a4bd5bf5'],
			},
			createdAt: {
				gte: new Date('2024-01-01').toISOString(),
			},
			published: {
				eq: true,
			},
		},
		// filterLogical: {
		// 	and: [
		// 		{ published: { eq: true } }, // or { published: true }
		// 		{
		// 			or: [
		// 				{ blogId: { eq: '46633897-5768-4e72-9039-1858a4bd5bf5' } },
		// 				{ blogId: { in: ['46633897-5768-4e72-9039-1858a4bd5bf5', '46633897-5768-4e72-9039-1858a4bd5bf6'] } },
		// 			],
		// 		},
		// 		{ not: { createdAt: { lt: new Date('2024-01-01') } } },
		// 	],
		// },
	},
})

if (error) {
	console.error(error)
} else {
	console.log(data)
}
