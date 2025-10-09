import { Elysia } from 'elysia'

import * as ProductModel from './model'
import * as ProductService from './service'

export const productController = new Elysia({ prefix: '/products' })
	.get(
		'/',
		({ query }) => ProductService.listProducts(query),
		{
			query: ProductModel.listProductsQuery,
			response: {
				200: ProductModel.listProductsResponse,
			},
			detail: {
				tags: ['Products'],
				summary: 'List products',
				description: 'Get a paginated list of products with optional filters',
			},
		}
	)
	.get(
		'/:id',
		({ params }) => ProductService.getProductById(params.id),
		{
			params: ProductModel.productIdParam,
			response: {
				200: ProductModel.product,
				404: ProductModel.errorNotFound,
			},
			detail: {
				tags: ['Products'],
				summary: 'Get product by ID',
				description: 'Get a specific product by its ID',
			},
		}
	)
	.post(
		'/',
		({ body }) => ProductService.createProduct(body),
		{
			body: ProductModel.createProductBody,
			response: {
				200: ProductModel.createProductResponse,
				409: ProductModel.errorDuplicateSku,
			},
			detail: {
				tags: ['Products'],
				summary: 'Create product',
				description: 'Create a new product',
			},
		}
	)
	.put(
		'/:id',
		({ params, body }) => ProductService.updateProduct(params.id, body),
		{
			params: ProductModel.productIdParam,
			body: ProductModel.updateProductBody,
			response: {
				200: ProductModel.updateProductResponse,
				404: ProductModel.errorNotFound,
				409: ProductModel.errorDuplicateSku,
			},
			detail: {
				tags: ['Products'],
				summary: 'Update product',
				description: 'Update an existing product',
			},
		}
	)
	.delete(
		'/:id',
		({ params }) => {
			ProductService.deleteProduct(params.id)
			return { message: 'Product deleted successfully' }
		},
		{
			params: ProductModel.productIdParam,
			response: {
				200: ProductModel.successMessage,
				404: ProductModel.errorNotFound,
			},
			detail: {
				tags: ['Products'],
				summary: 'Delete product',
				description: 'Delete a product by its ID',
			},
		}
	)
