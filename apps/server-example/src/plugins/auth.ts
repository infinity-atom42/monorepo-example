import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Elysia } from 'elysia'

import { pool } from '@se/db/db'
import { env } from '@se/env'

import * as authSchema from '../../../web-example/src/db/auth-schema'

// Connect to the SAME database where sessions are stored (web_example)
const authDb = drizzle(pool, { schema: authSchema })

// Backend auth instance ONLY for session validation (not for handling auth endpoints)
const auth = betterAuth({
	appName: env.APP_NAME,
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.API_BASE_URL, // Where THIS backend is running (http://localhost:3101)
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			domain: env.API_BASE_URL, // your backend domain
		},
	},
	trustedOrigins: [env.API_CLIENT_BASE_URL], // Trust requests from backend
	database: drizzleAdapter(authDb, {
		provider: 'pg',
		usePlural: true,
		schema: authSchema,
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
