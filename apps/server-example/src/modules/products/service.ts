import { mergeWith } from 'lodash-es'

import { InvariantError } from '@/errors/invariant'
import type * as ProductModel from './model'

const dummyProducts: ProductModel.Product[] = [
	{
		id: 'product_1',
		name: 'Wireless Keyboard',
		description: 'Ergonomic wireless keyboard with mechanical switches',
		price: 89.99,
		sku: 'KB-WL-001',
		inStock: true,
		category: 'Electronics',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: 'product_2',
		name: 'USB-C Cable',
		description: 'High-speed USB-C to USB-C cable, 2 meters',
		price: 15.99,
		sku: 'CBL-USC-002',
		inStock: true,
		category: 'Accessories',
		createdAt: '2024-01-02T00:00:00Z',
		updatedAt: '2024-01-02T00:00:00Z',
	},
	{
		id: 'product_3',
		name: 'Laptop Stand',
		description: 'Adjustable aluminum laptop stand',
		price: 45.00,
		sku: 'ACC-LS-003',
		inStock: false,
		category: 'Accessories',
		createdAt: '2024-01-03T00:00:00Z',
		updatedAt: '2024-01-03T00:00:00Z',
	},
	{
		id: 'product_4',
		name: 'Wireless Mouse',
		description: 'Precision wireless mouse with adjustable DPI',
		price: 39.99,
		sku: 'MS-WL-004',
		inStock: true,
		category: 'Electronics',
		createdAt: '2024-01-04T00:00:00Z',
		updatedAt: '2024-01-04T00:00:00Z',
	},
]

function generateProductId(): string {
	return `product_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

export function createProduct(data: ProductModel.CreateProductBody): ProductModel.CreateProductResponse {
	// Check for duplicate SKU
	const existingProduct = dummyProducts.find((p) => p.sku === data.sku)
	if (existingProduct) {
		throw new InvariantError('Product with this SKU already exists')
	}

	const newProduct: ProductModel.Product = {
		id: generateProductId(),
		name: data.name,
		description: data.description,
		price: data.price,
		sku: data.sku,
		inStock: data.inStock ?? true,
		category: data.category,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}

	dummyProducts.push(newProduct)

	return newProduct
}

export function getProductById(productId: string): ProductModel.Product {
	const product = dummyProducts.find((p) => p.id === productId)

	if (!product) {
		throw new InvariantError('Product not found')
	}

	return product
}

export function updateProduct(
	productId: string,
	data: ProductModel.UpdateProductBody
): ProductModel.UpdateProductResponse {
	const productIndex = dummyProducts.findIndex((p) => p.id === productId)

	if (productIndex === -1) {
		throw new InvariantError('Product not found')
	}

	const product = dummyProducts[productIndex]

	// Check for duplicate SKU if SKU is being updated
	if (data.sku && data.sku !== product?.sku) {
		const existingProduct = dummyProducts.find((p) => p.sku === data.sku)
		if (existingProduct) {
			throw new InvariantError('Product with this SKU already exists')
		}
	}

	const updatedProduct = mergeWith(
		product,
		data,
		{ updatedAt: new Date().toISOString() },
		(objValue, srcValue) => srcValue ?? objValue
	)

	dummyProducts[productIndex] = updatedProduct

	return updatedProduct
}

export function deleteProduct(productId: string): void {
	const productIndex = dummyProducts.findIndex((p) => p.id === productId)

	if (productIndex === -1) {
		throw new InvariantError('Product not found')
	}

	dummyProducts.splice(productIndex, 1)
}

export function listProducts(query: ProductModel.ListProductsQuery): ProductModel.ListProductsResponse {
	const { page = 1, limit = 10, inStock, category, minPrice, maxPrice } = query

	let filteredProducts = dummyProducts

	// Apply inStock filter
	if (inStock !== undefined) {
		filteredProducts = filteredProducts.filter((p) => p.inStock === inStock)
	}

	// Apply category filter
	if (category) {
		filteredProducts = filteredProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
	}

	// Apply price range filter
	if (minPrice !== undefined) {
		filteredProducts = filteredProducts.filter((p) => p.price >= minPrice)
	}
	if (maxPrice !== undefined) {
		filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice)
	}

	// Apply pagination
	const startIndex = (page - 1) * limit
	const endIndex = startIndex + limit
	const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

	return {
		products: paginatedProducts,
		total: filteredProducts.length,
		page,
		limit,
	}
}
