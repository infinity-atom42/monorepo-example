import { BaseHttpError } from './base-http'

export class InvariantError extends BaseHttpError {
	status = 400
	productionMessage = 'Bad request'

	constructor(message: string = 'Invalid request', cause?: unknown) {
		super(message, cause)
		this.name = 'InvariantError'
	}
}
