import { Elysia } from 'elysia'

export const requestLogger = new Elysia({ name: 'request.logger' })
	.derive(({ request }) => {
		const requestTime = Date.now()
		const requestIP = request.headers.get('x-forwarded-for') || 'unknown'

		return {
			requestTime,
			requestIP,
		}
	})
	.onAfterHandle(({ request, requestTime, requestIP }) => {
		const duration = Date.now() - requestTime
		console.log(`[${new Date().toISOString()}] ${request.method} ${request.url} - ${requestIP} - ${duration}ms`)
	})
