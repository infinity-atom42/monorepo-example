/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotImplementedError } from '@se/errors'
import type * as ProductModel from './model'

export function createProduct(_data: ProductModel.CreateProductBody): ProductModel.CreateProductResponse {
	throw new NotImplementedError('createProduct')
}

export function getProductById(_productId: ProductModel.ProductId): ProductModel.Product {
	throw new NotImplementedError('getProductById')
}

export function updateProduct(_productId: ProductModel.ProductId, _data: ProductModel.UpdateProductBody): ProductModel.UpdateProductResponse {
	throw new NotImplementedError('updateProduct')
}

export function deleteProduct(_productId: ProductModel.ProductId): void {
	throw new NotImplementedError('deleteProduct')
}

export function listProducts(_query: ProductModel.ListProductsQuery): ProductModel.ListProductsResponse {
	throw new NotImplementedError('listProducts')
}
