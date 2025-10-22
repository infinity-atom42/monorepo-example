import { describe, expect, test } from 'bun:test'
import { treaty } from '@elysiajs/eden'

import { app, type App } from '@se/server'

describe('Server Smoke Tests', () => {
	const api = treaty<App>(app)

	test('should return welcome message from root', async () => {
		const { data, error } = await api.get()

		expect(error).toBeNull()
		expect(data).toMatchObject({
			message: 'Welcome to ElysiaJS Example API',
		})
	})

	test('should return health check', async () => {
		const { data, error } = await api.health.get()

		expect(error).toBeNull()
		expect(data).toMatchObject({
			status: 'ok',
		})
	})

	test('should access v1 routes', async () => {
		const { data, error } = await api.v1.blogs.post({
			name: 'Smoke Test Blog',
			artiom: 'test',
		})

		expect(error).toBeNull()
		expect(data?.name).toBe('Smoke Test Blog')
	})
})
