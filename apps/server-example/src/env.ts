import { z } from 'zod'

import { createEnv } from '@t3-oss/env-core'

export const env = createEnv({
	server: {
		PORT: z.coerce.number().int().positive(),
		NODE_ENV: z.enum(['development', 'production', 'test']),
		DATABASE_URL: z.url(),
		API_CLIENT_BASE_URL: z.url(),
		API_BASE_URL: z.url(),
	},

	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
