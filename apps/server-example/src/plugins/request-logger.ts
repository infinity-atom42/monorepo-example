import { Elysia } from 'elysia'

export const requestLogger = new Elysia({ name: 'request.logger' })
	.onRequest(({ request }) => {
		const url = new URL(request.url)
		const timestamp = new Date().toISOString()
		
		console.log('📥 Incoming Request:', {
			timestamp,
			method: request.method,
			path: url.pathname,
			query: url.search || 'none',
			headers: {
				'user-agent': request.headers.get('user-agent'),
				'content-type': request.headers.get('content-type'),
				'authorization': request.headers.get('authorization') ? '✓ Present' : '✗ None',
				'origin': request.headers.get('origin'),
			},
			url: request.url,
		})
	})
	.onAfterResponse(({ request, set }) => {
		const url = new URL(request.url)
		const timestamp = new Date().toISOString()
		
		console.log('📤 Response:', {
			timestamp,
			method: request.method,
			path: url.pathname,
			status: set.status || 200,
		})
	})
	.as('global')
