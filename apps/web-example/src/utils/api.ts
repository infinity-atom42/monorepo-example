import { clientEnv } from '@/env'
import { treaty } from '@elysiajs/eden'

import type { App } from '../../../server-example/src/server'

export const example = treaty<App>(clientEnv.NEXT_PUBLIC_EXAMPLE_API_URL, {
	fetch: {
		credentials: 'include',
	},
})
