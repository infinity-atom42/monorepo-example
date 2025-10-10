import { Elysia } from 'elysia'
import * as z from 'zod'

import { env } from '@/env'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'

import { errorHandling } from './errors'
import { postController, productController } from './modules'
import { requestLogger } from './plugins'

const app = new Elysia()
	.use(cors())
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
							bearerFormat: 'JWT'
						}
					}
				}
			}
		})
	)
	.use(requestLogger)
	.use(errorHandling)
	.get('/', () => ({
		message: 'Welcome to ElysiaJS Example API',
		version: '0.1.0',
	}))
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
	}))
	.group('/api/v1', (app) => app.use(postController).use(productController))
	.listen(env.PORT)

export { app }
