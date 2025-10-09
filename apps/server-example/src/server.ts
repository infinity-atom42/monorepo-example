import { Elysia } from 'elysia'

import { env } from '@/env'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'

import { errorHandling } from './errors'
import { postController, productController } from './modules'
import { auth, requestLogger } from './plugins'

const app = new Elysia()
	.use(cors())
	.use(openapi())
	.use(requestLogger)
	.use(errorHandling)
	.get('/', () => ({
		message: 'Welcome to ElysiaJS Example API',
		version: '1.0.0',
	}))
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
	}))
	.group('/api/v1', (app) => app.use(auth).use(postController).use(productController))
	.listen(env.PORT)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
