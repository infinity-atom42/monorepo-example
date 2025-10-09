import { Elysia } from 'elysia'

import { env } from '@/env'

import { AuthenticationError } from './authentication'
import { AuthorizationError } from './authorization'
import { InvariantError } from './invariant'

export const errorHandling = new Elysia({ name: 'errorHandling' })
	.error('AUTHENTICATION_ERROR', AuthenticationError)
	.error('AUTHORIZATION_ERROR', AuthorizationError)
	.error('INVARIANT_ERROR', InvariantError)
	.onError(({ code, error, set }) => {
		/**
		 * Handle the error based on the code
		 */
		switch (code) {
			case 'AUTHENTICATION_ERROR':
			case 'AUTHORIZATION_ERROR':
			case 'INVARIANT_ERROR':
			case 'VALIDATION':
			case 'INVALID_FILE_TYPE':
				return error.toResponse()

			default: {
				console.error('Unhandled error:', error)
				set.status = 500

				if (code !== 'UNKNOWN' && typeof code !== 'number') {
					set.status = error.status
				}

				// typeof code === 'number' is add to avoid a bug in the type system.
				// TODO: report this to the Elysia team

				if (env.NODE_ENV === 'development') {
					if (typeof code === 'number') {
						return { error: 'This should never happen.' }
					}
					return {
						code,
						error: error.message,
						cause: error.cause instanceof Error ? error.cause.message : String(error.cause),
					}
				}
				return {
					error: 'Internal server error',
				}
			}
		}
	})
