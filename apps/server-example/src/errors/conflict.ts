import { BaseHttpError } from './base-http'

export class ConflictError extends BaseHttpError {
	status = 409
	productionMessage = 'Resource conflict'

	constructor(message: string = 'Resource conflict', cause?: unknown) {
		super(message, cause)
		this.name = 'ConflictError'
	}
}
