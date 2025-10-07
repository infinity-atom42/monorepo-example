import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

export const clientEnv = createEnv({
	client: {
		NEXT_PUBLIC_APP_NAME: z.string(),
		NEXT_PUBLIC_BASE_URL: z.url(),
	},

	runtimeEnv: {
		NEXT_PUBLIC_APP_NAME: process.env['NEXT_PUBLIC_APP_NAME'],
		NEXT_PUBLIC_BASE_URL: process.env['NEXT_PUBLIC_BASE_URL'],
	},
})
