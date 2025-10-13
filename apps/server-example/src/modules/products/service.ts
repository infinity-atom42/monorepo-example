/* eslint-disable @typescript-eslint/no-unused-vars */
import { DrizzleQueryError, eq } from 'drizzle-orm'

import db from '@se/db'
import { products } from '@se/db/schema'
import { ConflictError, NotFoundError, NotImplementedError } from '@se/errors'

import type * as ProductModel from './model'

export async function createProduct(data: ProductModel.CreateProductBody): Promise<ProductModel.CreateProductResponse> {
	try {
		const [product] = await db.insert(products).values(data).returning()

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return product!
	} catch (error) {
		// Handle unique constraint violation for SKU
		if (error instanceof DrizzleQueryError && error.cause && 'code' in error.cause && error.cause.code === '23505') {
			throw new ConflictError('Product with this SKU already exists', error.cause)
		}
		throw error
	}
}

export async function getProductById(productId: ProductModel.ProductId): Promise<ProductModel.Product> {
	const [product] = await db.select().from(products).where(eq(products.id, productId))

	if (!product) {
		throw new NotFoundError('Product not found')
	}

	return product
}

export async function updateProduct(
	productId: ProductModel.ProductId,
	data: ProductModel.UpdateProductBody
): Promise<ProductModel.UpdateProductResponse> {
	try {
		const [product] = await db.update(products).set(data).where(eq(products.id, productId)).returning()

		if (!product) {
			throw new NotFoundError('Product not found')
		}

		return product
	} catch (error) {
		// Handle unique constraint violation for SKU
		if (error instanceof Error && 'code' in error && error.code === '23505') {
			throw new ConflictError('Product with this SKU already exists')
		}
		throw error
	}
}

export async function deleteProduct(productId: ProductModel.ProductId): Promise<void> {
	const [product] = await db.delete(products).where(eq(products.id, productId)).returning()

	if (!product) {
		throw new NotFoundError('Product not found')
	}
}

export function listProducts(_query: ProductModel.ListProductsQuery): ProductModel.ListProductsResponse {
	throw new NotImplementedError('listProducts')
}
