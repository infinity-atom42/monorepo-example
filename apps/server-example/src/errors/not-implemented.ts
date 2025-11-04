import BaseHttpError from './base-http-error'

export class NotImplementedError extends BaseHttpError {
	status = 501 // HTTP 501 Not Implemented

	constructor(message: string = 'Not implemented', cause?: unknown) {
		super(message, { cause })
		this.name = 'NotImplementedError'
	}
}
