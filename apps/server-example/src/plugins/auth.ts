import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { Elysia } from 'elysia'

import db from '@se/db/auth-db'
import { env } from '@se/env'

import * as schema from '../../../web-example/src/db/auth-schema'

// Backend auth instance ONLY for session validation (not for handling auth endpoints)
const auth = betterAuth({
	appName: env.APP_NAME,
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.API_BASE_URL, // Where THIS backend is running (http://localhost:3101)
	// advanced: {
	// 	crossSubDomainCookies: {
	// 		enabled: true,
	// 		domain: env.API_BASE_URL, // your backend domain
	// 	},
	// },
	trustedOrigins: [env.API_CLIENT_BASE_URL], // Trust requests from backend
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
		schema,
	}),
})

const authPlugin = new Elysia({ name: 'auth' })
	// Don't mount auth.handler - we only validate sessions, not handle auth endpoints
	.derive({ as: 'scoped' }, async ({ status, request: { headers } }) => {
		const session = await auth.api.getSession({ headers })

		if (!session) return status(401)

		return { user: session.user }
	})
	.as('scoped')

export { authPlugin as auth }
