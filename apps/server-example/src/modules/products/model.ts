import { z } from 'zod'

// Product entity
export const product = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	sku: z.string(),
	inStock: z.boolean(),
	category: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
})
export type Product = z.infer<typeof product>

// Create product
export const createProductBody = z.object({
	name: z.string().min(1).max(200),
	description: z.string().min(1),
	price: z.number().positive(),
	sku: z.string().min(1).max(100),
	inStock: z.boolean().default(true).optional(),
	category: z.string().min(1),
})
export type CreateProductBody = z.infer<typeof createProductBody>

export const createProductResponse = product
export type CreateProductResponse = z.infer<typeof createProductResponse>

// Update product
export const updateProductBody = z.object({
	name: z.string().min(1).max(200).optional(),
	description: z.string().min(1).optional(),
	price: z.number().positive().optional(),
	sku: z.string().min(1).max(100).optional(),
	inStock: z.boolean().optional(),
	category: z.string().min(1).optional(),
})
export type UpdateProductBody = z.infer<typeof updateProductBody>

export const updateProductResponse = product
export type UpdateProductResponse = z.infer<typeof updateProductResponse>

// List products
export const listProductsQuery = z.object({
	page: z.coerce.number().min(1).default(1).optional(),
	limit: z.coerce.number().min(1).max(100).default(10).optional(),
	inStock: z
		.string()
		.transform((val) => val === 'true')
		.optional(),
	category: z.string().optional(),
	minPrice: z.coerce.number().min(0).optional(),
	maxPrice: z.coerce.number().min(0).optional(),
})
export type ListProductsQuery = z.infer<typeof listProductsQuery>

export const listProductsResponse = z.object({
	products: z.array(product),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
})
export type ListProductsResponse = z.infer<typeof listProductsResponse>

// Product ID param
export const productIdParam = z.object({
	id: z.string(),
})
export type ProductIdParam = z.infer<typeof productIdParam>

// Error responses
export const errorNotFound = z.object({ message: z.literal('Product not found') })
export const errorDuplicateSku = z.object({ message: z.literal('Product with this SKU already exists') })
export const successMessage = z.object({ message: z.string() })
