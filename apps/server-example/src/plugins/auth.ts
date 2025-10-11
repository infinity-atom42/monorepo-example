import { Elysia } from 'elysia'
import { z } from 'zod'
import { createRemoteJWKSet, jwtVerify } from 'jose'

import { env } from '@se/env'
import { AuthenticationError } from '@se/errors/authentication'
import { bearer } from '@elysiajs/bearer'

// Get Better Auth JWKS URL from environment
const JWKS_URL = `${env.API_CLIENT_BASE_URL}/api/auth/jwks`

// Create remote JWKS - this will be cached automatically by jose
const JWKS = createRemoteJWKSet(new URL(JWKS_URL))

// Schema for validating JWT token payload
const userSchema = z.object({
	id: z.string(),
	email: z.email(),
	name: z.string(),
})

export const auth = new Elysia({ name: 'auth' })
	.use(bearer())
	.derive({ as: 'scoped' }, async ({ bearer, set }) => {
		if (!bearer) {
			set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`
			throw new AuthenticationError('Bearer token is required')
		}

		try {
			// Verify JWT using Better Auth's JWKS
			const { payload } = await jwtVerify(bearer, JWKS, {
				issuer: env.API_CLIENT_BASE_URL, // Trust tokens from Next.js app
				audience: env.API_BASE_URL, // Verify token is for THIS API
			})

			// Extract user data from JWT payload
			const userPayload = {
				id: payload.sub,
				email: payload['email'],
				name: payload['name'],
			}

			// Validate token payload structure
			const zUser = userSchema.safeParse(userPayload)

			if (!zUser.success) {
				const errorTree = z.treeifyError(zUser.error)
				set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_token"`
				throw new AuthenticationError('Invalid token payload structure', errorTree)
			}

			return { user: zUser.data }
		} catch (error) {
			set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_token"`
			throw new AuthenticationError('Invalid or expired token', error)
		}
	})
