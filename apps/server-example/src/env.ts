import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	server: {
		PORT: z.coerce.number().int().positive(),
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.url(),
		NODE_ENV: z.enum(['development', 'production', 'test']),
	},

	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
