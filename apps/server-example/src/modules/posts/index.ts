import { Elysia } from 'elysia'

import { auth } from '@se/plugins/auth'

import * as PostModel from './model'
import * as PostService from './service'

export const postController = new Elysia({ prefix: '/posts' })
	.use(auth)
	.get('/', ({ query }) => PostService.listPosts(query), {
		query: PostModel.listPostsQuery,
		response: {
			200: PostModel.listPostsResponse,
		},
		detail: {
			tags: ['Posts'],
			summary: 'List posts',
			description: 'Get a paginated list of posts with optional filters',
		},
	})
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
	.post(
		'/',
		({ body }) => PostService.createPost(body),
		{
			body: PostModel.createPostBody,
			response: {
				200: PostModel.createPostResponse,
			},
			detail: {
				tags: ['Posts'],
				summary: 'Create post',
				description: 'Create a new post',
			},
		}
	)
	.put(
		'/:postId',
		({ params, body }) => PostService.updatePost(params.postId, body),
		{
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
		}
	)
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
