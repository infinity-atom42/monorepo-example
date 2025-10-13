import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

export const serverEnv = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'production', 'test']),
		DATABASE_URL: z.url(),
		AUTH_DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string(),
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),
	},

	experimental__runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
