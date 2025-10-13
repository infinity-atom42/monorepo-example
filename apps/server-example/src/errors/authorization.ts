import BaseHttpError from './base-http-error'

export class AuthorizationError extends BaseHttpError {
	status = 403

	constructor(message: string = 'Access denied', cause?: unknown) {
		super(message, { cause })
		this.name = 'AuthorizationError'
	}
}
