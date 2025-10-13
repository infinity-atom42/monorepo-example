export default abstract class BaseHttpError extends Error {
	abstract status: number

	constructor(message: string, cause?: unknown) {
		super(message, { cause })
	}

	toResponse() {
		return Response.json(
			{
				code: this.name,
				error: this.message,
				cause: this.cause,
			},
			{ status: this.status }
		)
	}
}
