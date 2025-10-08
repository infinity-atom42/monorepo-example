import { betterAuth, type Auth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { openAPI } from 'better-auth/plugins'

import db from '@/db'
import * as schema from '@/db/auth-schema'
import { clientEnv, serverEnv } from '@/env'

export const auth: Auth = betterAuth({
	appName: clientEnv.NEXT_PUBLIC_APP_NAME,
	// disabledPaths: ['/token'],
	plugins: [
		openAPI(),
		nextCookies(),
		// jwt({
		// 	disableSettingJwtHeader: true,
		// }),
	],
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: serverEnv.GITHUB_CLIENT_ID,
			clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
		},
	},
})
