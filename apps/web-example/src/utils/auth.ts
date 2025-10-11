import { betterAuth, type Auth as BetterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { openAPI } from 'better-auth/plugins'

import db from '@/db'
import * as schema from '@/db/auth-schema'
import { clientEnv, serverEnv } from '@/env'

export const auth: BetterAuth = betterAuth({
	appName: clientEnv.NEXT_PUBLIC_APP_NAME,
	baseURL: clientEnv.NEXT_PUBLIC_BASE_URL,
	secret: serverEnv.BETTER_AUTH_SECRET,
	// For localhost with different ports, we need SameSite=None
	// In production with subdomains, use crossSubDomainCookies instead
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			domain: clientEnv.NEXT_PUBLIC_BASE_URL, // your domain
		},
		// useSecureCookies: true, // TODO: how to make this work?
	},
	trustedOrigins: [clientEnv.NEXT_PUBLIC_EXAMPLE_API_URL],
	plugins: [
		openAPI(),
		nextCookies(),
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

export type Auth = typeof auth
