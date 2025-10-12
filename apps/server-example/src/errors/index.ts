import { Elysia } from 'elysia'

import { env } from '@se/env'

import { AuthenticationError } from './authentication'
import { AuthorizationError } from './authorization'
import { ConflictError } from './conflict'
import { InvariantError } from './invariant'
import { NotFoundError } from './not-found'
import { NotImplementedError } from './not-implemented'

// Export error classes for use in other modules
export { AuthenticationError, AuthorizationError, ConflictError, InvariantError, NotFoundError, NotImplementedError }

export const errorHandling = new Elysia({ name: 'errorHandling' })
	.error('AUTHENTICATION_ERROR', AuthenticationError)
	.error('AUTHORIZATION_ERROR', AuthorizationError)
	.error('CONFLICT_ERROR', ConflictError)
	.error('INVARIANT_ERROR', InvariantError)
	.error('NOT_FOUND_ERROR', NotFoundError)
	.error('NOT_IMPLEMENTED_ERROR', NotImplementedError)
	.onError(({ code, error, set }) => {
		/**
		 * Handle the error based on the code
		 */
		switch (code) {
			case 'AUTHENTICATION_ERROR':
			case 'AUTHORIZATION_ERROR':
			case 'CONFLICT_ERROR':
			case 'INVARIANT_ERROR':
			case 'NOT_FOUND_ERROR':
			case 'NOT_IMPLEMENTED_ERROR':
			case 'VALIDATION':
			case 'INVALID_FILE_TYPE':
				return error.toResponse()

			default: {
				console.error('Unhandled error:', error)
				set.status = 500

				if (code !== 'UNKNOWN' && typeof code !== 'number') {
					set.status = error.status
				}
				if (env.NODE_ENV === 'development') {
					// TODO: report this to the Elysia team
					// typeof code === 'number' is add to avoid a bug in the type system.
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
