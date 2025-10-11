import { treaty } from '@elysiajs/eden'
import type { App } from '../../../server-example/src/server'

import { clientEnv } from '@/env'

export const api = {
	example: treaty<App>(clientEnv.NEXT_PUBLIC_EXAMPLE_API_URL, {
		fetch: {
			credentials: 'include',
		},
	}),
} as const

api.example.api.v1.products.get() // this is typed
api.example.api.v1.posts.get() // this is of type any
