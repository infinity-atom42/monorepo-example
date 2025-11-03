import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { Elysia } from 'elysia'

import db from '@se/db/auth-db'
import { env } from '@se/env'

import * as schema from '../../../web-example/src/auth/drizzle.schema'

// Mock user for testing environment
const MOCK_TEST_USER = {
	id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
	name: 'Test User',
	email: 'test@example.com',
	emailVerified: true,
	image: null,
	createdAt: new Date('2024-01-01T00:00:00.000Z'),
	updatedAt: new Date('2024-01-01T00:00:00.000Z'),
}

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
		// In test environment, always return mock user (bypass auth)
		if (process.env.NODE_ENV === 'test' || process.env['E2E_TEST'] !== 'true') {
			return { user: MOCK_TEST_USER }
		}

		// Production/Development: validate real session
		const session = await auth.api.getSession({ headers })

		if (!session) return status(401)

		return { user: session.user }
	})
	.as('scoped')

export { authPlugin as auth }
