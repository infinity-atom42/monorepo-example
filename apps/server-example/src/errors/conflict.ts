import BaseHttpError from './base-http-error'

export class ConflictError extends BaseHttpError {
	status = 409

	constructor(message: string = 'Resource conflict', cause?: unknown) {
		super(message, { cause })
		this.name = 'ConflictError'
	}
}
