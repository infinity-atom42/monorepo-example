import { Elysia } from 'elysia'

import { auth } from '@/plugins/auth'
import * as PostModel from './model'
import * as PostService from './service'

export const postController = new Elysia({ prefix: '/posts' })
	.use(auth)
	.get(
		'/',
		({ query }) => PostService.listPosts(query),
		{
			query: PostModel.listPostsQuery,
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
	.get(
		'/:id',
		({ params }) => PostService.getPostById(params.id),
		{
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
		}
	)
	.post(
		'/',
		({ body, user }) => {
			return PostService.createPost(user.id, body)
		},
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
		'/:id',
		({ params, body, user }) => {
			return PostService.updatePost(params.id, user.id, body)
		},
		{
			params: PostModel.postIdParam,
			body: PostModel.updatePostBody,
			response: {
				200: PostModel.updatePostResponse,
				404: PostModel.errorNotFound,
				403: PostModel.errorUnauthorized,
			},
			detail: {
				tags: ['Posts'],
				summary: 'Update post',
				description: 'Update an existing post',
			},
		}
	)
	.delete(
		'/:id',
		({ params, user }) => {
			PostService.deletePost(params.id, user.id)
			return { message: 'Post deleted successfully' }
		},
		{
			params: PostModel.postIdParam,
			response: {
				200: PostModel.successMessage,
				404: PostModel.errorNotFound,
				403: PostModel.errorUnauthorized,
			},
			detail: {
				tags: ['Posts'],
				summary: 'Delete post',
				description: 'Delete a post by its ID',
			},
		}
	)
