import { beforeAll, describe, expect, test } from 'bun:test'

import { treaty } from '@elysiajs/eden'
import { blogController } from '@se/modules/blogs'
import { postController } from './index'

describe('Posts API', () => {
	// Create a type-safe client using Eden - using postController instance directly
	const api = treaty<typeof postController>(postController)
	let testBlogId: string

	// Setup: Create a blog first since posts need a blogId
	beforeAll(async () => {
		// Use blog module directly (cross-module dependency)
		const blogApi = treaty<typeof blogController>(blogController)
		const blogResult = await blogApi.blogs.post({
			name: 'Test Blog for Posts',
			artiom: 'Artiom value',
		})
		testBlogId = blogResult.data?.id ?? ''
	})

	test('should list posts', async () => {
		// Fully type-safe API call with autocomplete
		const { data, error } = await api.posts.get({
			query: {
				page: 1,
				limit: 10,
			},
		})

		expect(error).toBeNull()
		expect(data).toBeDefined()
		// Type-safe access to response properties (data and meta)
		expect(data?.data).toBeArray()
		expect(data?.meta).toBeDefined()
	})

	test('should create and get a post', async () => {
		// Create a post - Eden ensures body matches schema
		const createResult = await api.posts.post({
			title: 'Test Post',
			content: 'Test Content',
			someDate: new Date().toISOString(),
			blogId: testBlogId,
		})

		expect(createResult.error).toBeNull()
		expect(createResult.data).toBeDefined()
		const postId = createResult.data?.id ?? ''

		// Get the created post - types are inferred
		const getResult = await api.posts({ postId }).get()

		expect(getResult.error).toBeNull()
		expect(getResult.data?.title).toBe('Test Post')
	})
})
