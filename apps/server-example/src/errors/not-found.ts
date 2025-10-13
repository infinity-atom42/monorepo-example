import BaseHttpError from './base-http-error'

export class NotFoundError extends BaseHttpError {
	status = 404

	constructor(message: string = 'Resource not found', cause?: unknown) {
		super(message, { cause })
		this.name = 'NotFoundError'
	}

}
