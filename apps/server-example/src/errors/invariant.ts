import BaseHttpError from './base-http-error'

export class InvariantError extends BaseHttpError {
	status = 400

	constructor(message: string = 'Invalid request', cause?: unknown) {
		super(message, { cause })
		this.name = 'InvariantError'
	}
}
