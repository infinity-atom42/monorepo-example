import { describe, expect, test } from 'bun:test'

import { treaty } from '@elysiajs/eden'
import { productController } from './index'

describe('Products API', () => {
	// Create a type-safe client using Eden - using productController instance directly
	const api = treaty<typeof productController>(productController)

	test.skip('should list products', async () => {
		// Type-safe query parameters with autocomplete
		// Note: listProducts is not implemented yet (returns 501)
		const { data, error } = await api.products.get({
			query: {
				page: 1,
				limit: 10,
			},
		})

		expect(error).toBeNull()
		expect(data).toBeDefined()
		// Response has data and meta properties
		expect(data?.data).toBeArray()
	})

	test('should create and update a product', async () => {
		// Create product with full type validation
		const createResult = await api.products.post({
			name: 'Test Product',
			description: 'A test product',
			sku: `TEST-${Date.now()}`, // Unique SKU
			price: '99.99', // Money string format
			category: 'Electronics',
		})

		expect(createResult.error).toBeNull()
		const productId = createResult.data?.id ?? ''

		// Update with type-safe body - all fields optional
		const updateResult = await api.products({ productId }).put({
			name: 'Updated Product',
		})

		expect(updateResult.error).toBeNull()
		expect(updateResult.data?.name).toBe('Updated Product')
	})

	test('should get product by ID', async () => {
		// Create first
		const createResult = await api.products.post({
			name: 'Get Test',
			description: 'Product for get test',
			sku: `GET-${Date.now()}`,
			price: '49.99',
			category: 'Test',
		})

		const productId = createResult.data?.id ?? ''

		// Get with type inference - full type safety
		const { data, error } = await api.products({ productId }).get()

		expect(error).toBeNull()
		expect(data?.name).toBe('Get Test')
	})
})
