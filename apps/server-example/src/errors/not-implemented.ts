import { BaseHttpError } from './base-http'

export class NotImplementedError extends BaseHttpError {
	status = 501 // HTTP 501 Not Implemented
	productionMessage = 'This feature is not yet implemented'

	constructor(message: string = 'Not implemented', cause?: unknown) {
		super(message, cause)
		this.name = 'NotImplementedError'
	}
}
