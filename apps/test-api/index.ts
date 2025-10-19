import { treaty } from '@elysiajs/eden'
import type { App } from '@se/server'

export const example = treaty<App>('http://localhost:3101', {
	fetch: {
		credentials: 'include',
	},
})

// const { data, error } = await example.v1.blogs.post({
// 	artiom: 'test',
// 	name: 'Test Blog',
// })

// console.log(data)

// const { data, error } = await example.v1.posts.post({
// 	blogId: 'dba04ddb-8ce4-4454-86b7-aaf26d113c0e',
// 	title: 'Test Post',
// 	content: 'Test Content',
// 	someDate: new Date().toISOString(),
// 	published: true,
// })

// ✅ Type inference now works! All fields have autocomplete and type checking
const { data, error } = await example.v1.posts.get({
	query: {
		// Pagination (from paginationQuery)
		page: 1,
		limit: 3,
		select: ['content'],
		include: {
			blog: ['id', 'name', 'createdAt', 'updatedAt'],
		},
		sort: {
			createdAt: { order: 'desc', index: 1 },
		},
		filter: {
			blogId: {
				eq: 'dba04ddb-8ce4-4454-86b7-aaf26d113c0e',
			},
			createdAt: {
				// gte: new Date('2025-10-19 02:54:20.908Z').toISOString(),
			},
			// published: {
			// 	eq: true,
			// },
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
	for (const item of data.data) {
		console.log(item.blog)
	}
}
