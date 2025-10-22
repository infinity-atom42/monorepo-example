import { describe, expect, test } from 'bun:test'

import { treaty } from '@elysiajs/eden'
import { blogController } from './index'

describe('Blogs API', () => {
	// Create a type-safe client using Eden - using blogController instance directly
	const api = treaty<typeof blogController>(blogController)

	test('should create a blog', async () => {
		// Type-safe blog creation - Eden validates the request body
		const { data, error } = await api.blogs.post({
			name: 'Tech Blog',
			artiom: 'Artiom field value',
		})

		expect(error).toBeNull()
		expect(data).toBeDefined()
		// Autocomplete works for response properties
		expect(data?.name).toBe('Tech Blog')
	})

	test('should delete a blog', async () => {
		// First create a blog
		const createResult = await api.blogs.post({
			name: 'Temporary Blog',
			artiom: 'Will be deleted',
		})

		const blogId = createResult.data?.id ?? ''

		// Delete with type-safe params
		const { data, error } = await api.blogs({ blogId }).delete()

		expect(error).toBeNull()
		expect(data?.message).toBe('Blog deleted successfully')
	})
})
