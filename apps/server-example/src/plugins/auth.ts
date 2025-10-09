import { Elysia } from 'elysia'
import { z } from 'zod'

import { env } from '@/env'
import { AuthenticationError } from '@/errors/authentication'
import { bearer } from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'

// Schema for validating JWT token payload
const userSchema = z.object({
	id: z.string(),
	email: z.email(),
	name: z.string(),
	isSubscribed: z.boolean(),
})

export const auth = new Elysia({ name: 'auth' })
	.use(bearer())
	.use(
		jwt({
			name: 'jwt',
			secret: env.JWT_SECRET,
			exp: '7d',
		})
	)
	.derive({ as: 'scoped' }, async ({ bearer, set, jwt }) => {
		if (!bearer) {
			set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`
			throw new AuthenticationError('Bearer token is required')
		}

		const token = await jwt.verify(bearer)

		if (!token) {
			set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`
			throw new AuthenticationError('Invalid or expired token', bearer)
		}

		const userPayload = {
			...token,
			id: token.sub,
		}

		// Validate token payload structure
		const zUser = userSchema.safeParse(userPayload)

		if (!zUser.success) {
			const errorTree = z.treeifyError(zUser.error)
			set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_token"`
			throw new AuthenticationError('Invalid token payload structure', errorTree)
		}

		return { user: zUser.data }
	})
