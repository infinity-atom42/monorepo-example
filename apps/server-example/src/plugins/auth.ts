import { Elysia } from 'elysia'

import { env } from '@/env'
import { bearer } from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'

export interface User {
	id: string
	email: string
	name: string
	isSubscribed: boolean
}

export const auth = new Elysia({ name: 'auth' })
	.use(bearer())
	.use(
		jwt({
			name: 'jwt',
			secret: env.JWT_SECRET,
			exp: '7d',
		})
	)
	.resolve(async ({ bearer, set, jwt }) => {
		if (!bearer) {
			set.status = 401
			set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`

			return {
				status: 'error',
				message: 'Unauthorized',
			}
		}

		const token = await jwt.verify(bearer)

		if (!token) {
			set.status = 401
			set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`

			return {
				status: 'error',
				message: 'Unauthorized',
			}
		}

		return {
			user: {
				id: token['id'] as string,
				email: token['email'] as string,
				name: token['name'] as string,
				isSubscribed: token['isSubscribed'] as boolean,
			} as User,
		}
	})
