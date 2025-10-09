import { BaseHttpError } from './base-http'

export class AuthenticationError extends BaseHttpError {
	status = 401
	productionMessage = 'Authentication required'

	constructor(message: string = 'Authentication required', cause?: unknown) {
		super(message, cause)
		this.name = 'AuthenticationError'
	}
}
