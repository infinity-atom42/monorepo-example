import { clientEnv } from '@/env'
import { treaty } from '@elysiajs/eden'

import type { App } from '../../../server-example/src/server'

export const example = treaty<App>(clientEnv.NEXT_PUBLIC_EXAMPLE_API_URL, {
	fetch: {
		credentials: 'include',
	},
})

// ✅ Type inference now works! All fields have autocomplete and type checking
example.v1.posts.get({
	query: {
		// Pagination (from paginationQuery)
		page: 1,
		limit: 10,
		// Base field select
		select: ['id', 'title'],
		include: {
			blog: {
				select: ['id', 'name'],
			},
			// something else
			// somethingElse: {
			// 	select: ['something', 'else'],
			// },
		},
		sort: [
			{ field: 'createdAt', order: 'desc' },
			{ field: 'title', order: 'asc' },
		],
	},
})
