import BaseHttpError from './base-http-error'

export class AuthenticationError extends BaseHttpError {
	status = 401

	constructor(message: string = 'Authentication required', cause?: unknown) {
		super(message, { cause })
		this.name = 'AuthenticationError'
	}

}
