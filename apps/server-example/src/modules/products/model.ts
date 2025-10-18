import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// import { moneyString } from '@packages/schemas/decimal'
import { paginationQuery, paginationMeta } from '@packages/schemas/query'

import { products } from '@se/db/schema'

// Field validation rules
const productRefinements = {
	name: (schema: z.ZodString) => schema.min(1).max(200),
	description: (schema: z.ZodString) => schema.min(1),
	// price: () => moneyString,
	sku: (schema: z.ZodString) => schema.min(1).max(100),
	category: (schema: z.ZodString) => schema.min(1),
}

// Base schemas for CRUD operations
const select = createSelectSchema(products, productRefinements)
const insert = createInsertSchema(products, productRefinements).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})
const update = insert.partial()

// API request/response models
export const product = select
export const productId = product.shape.id
export const productIdParam = z.object({ productId: product.shape.id })
export const createProductBody = insert
export const createProductResponse = product
export const updateProductBody = update
export const updateProductResponse = product
export const listProductsQuery = z.object({
	...paginationQuery.shape,
	inStock: select.shape.inStock.optional(),
	category: select.shape.category.optional(),
	// minPrice: moneyString.optional(),
	// maxPrice: moneyString.optional(),
})
export const listProductsResponse = z.strictObject({
	data: z.array(product),
	meta: paginationMeta,
})

// API responses
export const errorNotFound = z.object({ message: z.literal('Product not found') })
export const errorDuplicateSku = z.object({ message: z.literal('Product with this SKU already exists') })
export const successMessage = z.object({ message: z.string() })

// Types
export type Product = z.infer<typeof product>
export type ProductId = z.infer<typeof productId>
export type ProductIdParam = z.infer<typeof productIdParam>
export type CreateProductBody = z.infer<typeof createProductBody>
export type CreateProductResponse = z.infer<typeof createProductResponse>
export type UpdateProductBody = z.infer<typeof updateProductBody>
export type UpdateProductResponse = z.infer<typeof updateProductResponse>
export type ListProductsQuery = z.infer<typeof listProductsQuery>
export type ListProductsResponse = z.infer<typeof listProductsResponse>
