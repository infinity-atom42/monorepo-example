import { Elysia } from 'elysia'
import z from 'zod'

import { uniqueArraySchema } from '@packages/schemas/utils'

import { ValidationError } from '@se/errors'
import { auth } from '@se/plugins/auth'

import * as PostModel from './model'
import * as PostService from './service'

export const postController = new Elysia({ prefix: '/posts' })
	// .use(auth)
	.onBeforeHandle(({ request, query }) => {
		console.log(request.url)
		console.log('--------------------------------')
		console.log(query)
	})
	.get(
		'/',
		({ query }) => {
			// The select arrays can have duplicates, so we need to validate them after validation
			// so openapi schema is generated correctly as modified data type is not accepted by openapi
			const { success, error } = z
				.object({
					select: uniqueArraySchema.optional(),
					includeBlog: uniqueArraySchema.optional(),
				})
				.safeParse({
					select: query.select,
					includeBlog: query.include?.blog,
				})
			if (!success) {
				throw new ValidationError('query', query, error.issues)
			}
			return PostService.listPosts(query)
		},
		{
			query: PostModel.listPostsQuery,
			transform: ({ query }) => {
				console.log('decoded query')
				console.log(query)
				console.log('--------------------------------')
				// If select has only one string value inside the query, then the parsed value is a string instead of an array
				// so we need to convert it manually to an array or else the validation will fail
				if (typeof query.select === 'string') {
					query.select = query.select ? [query.select] : []
				}
			},
			response: {
				200: PostModel.listPostsResponse,
			},
			detail: {
				tags: ['Posts'],
				summary: 'List posts',
				description: 'Get a paginated list of posts with optional filters',
			},
		}
	)
	.get('/:postId', ({ params }) => PostService.getPostById(params.postId), {
		params: PostModel.postIdParam,
		response: {
			200: PostModel.post,
			404: PostModel.errorNotFound,
		},
		detail: {
			tags: ['Posts'],
			summary: 'Get post by ID',
			description: 'Get a specific post by its ID',
		},
	})
	.post('/', ({ body }) => PostService.createPost(body), {
		body: PostModel.createPostBody,
		response: {
			200: PostModel.createPostResponse,
		},
		detail: {
			tags: ['Posts'],
			summary: 'Create post',
			description: 'Create a new post',
		},
	})
	.put('/:postId', ({ params, body }) => PostService.updatePost(params.postId, body), {
		params: PostModel.postIdParam,
		body: PostModel.updatePostBody,
		response: {
			200: PostModel.updatePostResponse,
			404: PostModel.errorNotFound,
		},
		detail: {
			tags: ['Posts'],
			summary: 'Update post',
			description: 'Update an existing post',
		},
	})
	.delete(
		'/:postId',
		({ params }) => {
			PostService.deletePost(params.postId)
			return { message: 'Post deleted successfully' }
		},
		{
			params: PostModel.postIdParam,
			response: {
				200: PostModel.successMessage,
				404: PostModel.errorNotFound,
			},
			detail: {
				tags: ['Posts'],
				summary: 'Delete post',
				description: 'Delete a post by its ID',
			},
		}
	)
