import { Elysia } from 'elysia'
import * as z from 'zod'

import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { env } from '@se/env'

import { errorHandling } from './errors'
import { postController, productController, blogController } from './modules'
// import { requestLogger } from './plugins'

const app = new Elysia()
	.use(
		cors({
			origin: env.API_CLIENT_BASE_URL,
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		})
	)
	.use(
		openapi({
			mapJsonSchema: {
				zod: z.toJSONSchema,
			},
			documentation: {
				components: {
					securitySchemes: {
						bearer: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
						},
					},
				},
			},
		})
	)
	// .use(requestLogger)
	.use(errorHandling)
	.get('/', () => ({
		message: 'Welcome to ElysiaJS Example API',
		version: '0.1.0',
	}))
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
	}))
	.group('/v1', (app) => app.use(postController).use(productController).use(blogController))
	.listen(env.PORT)

export { app }
export { pool } from './db'
export type App = typeof app
