import type { $ZodIssue } from 'zod/v4/core'

export class ValidationError extends Error {
	status = 400
	type = 'validation'
	on: string
	found: unknown
	errors: $ZodIssue[]

	constructor(on: string, found: unknown, issues: $ZodIssue[]) {
		super('Validation failed')
		this.name = 'ValidationError'
		this.on = on
		this.found = found
		this.errors = issues
	}

	toResponse() {

		return Response.json({
			type: this.type,
			on: this.on,
			message: this.message,
			found: this.found,
			errors: this.errors,
		}, { status: this.status })
	}
}
