import { BaseHttpError } from './base-http'

export class AuthorizationError extends BaseHttpError {
	status = 403
	productionMessage = 'Access denied'

	constructor(message: string = 'Access denied', cause?: unknown) {
		super(message, cause)
		this.name = 'AuthorizationError'
	}
}
