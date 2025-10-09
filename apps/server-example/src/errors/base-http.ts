import { env } from 'elysia'

export abstract class BaseHttpError extends Error {
	abstract status: number
	abstract productionMessage: string

	constructor(message: string, cause?: unknown) {
		super(message, { cause })
	}

	toResponse() {
		const body =
			env.NODE_ENV === 'development'
				? {
						code: this.name,
						error: this.message,
						cause: this.cause instanceof Error ? this.cause.message : String(this.cause),
					}
				: { error: this.productionMessage }

		return Response.json(body, { status: this.status })
	}
}
