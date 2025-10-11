import { treaty } from '@elysiajs/eden'
import type { App } from './server'

import { env } from '@se/env'

export const api = {
	example: treaty<App>(env.API_BASE_URL, {
		fetch: {
			credentials: 'include',
		},
	}),
} as const

api.example.api.v1.products.get() // this is also typed
api.example.api.v1.posts.get() // this is typed
