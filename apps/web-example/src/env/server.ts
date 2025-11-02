import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

export const serverEnv = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'production', 'test']),
		AUTH_DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string(),
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),
		DEFAULT_USER_EMAIL: z.email(),
		DEFAULT_USER_PASSWORD: z.string().min(8),
		DEFAULT_USER_NAME: z.string().min(3),
	},

	experimental__runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
