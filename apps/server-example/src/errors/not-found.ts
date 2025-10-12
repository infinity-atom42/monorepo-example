import { BaseHttpError } from './base-http'

export class NotFoundError extends BaseHttpError {
	status = 404
	productionMessage = 'Resource not found'

	constructor(message: string = 'Resource not found', cause?: unknown) {
		super(message, cause)
		this.name = 'NotFoundError'
	}
}
