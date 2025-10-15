import { Elysia } from 'elysia'

import { auth } from '@se/plugins/auth'

import * as BlogModel from './model'
import * as BlogService from './service'

export const blogController = new Elysia({ prefix: '/blogs' })
	.use(auth)
	.post('/', ({ body }) => BlogService.createBlog(body), {
		body: BlogModel.createBlogBody,
		response: {
			200: BlogModel.createBlogResponse,
		},
		detail: {
			tags: ['Blogs'],
			summary: 'Create blog',
			description: 'Create a new blog',
		},
	})
	.delete('/:blogId', ({ params }) => {
		BlogService.deleteBlog(params.blogId)
		return { message: 'Blog deleted successfully' }
	}, {
		params: BlogModel.blogIdParam,
		response: {
			200: BlogModel.successMessage,
		},
		detail: {
			tags: ['Blogs'],
			summary: 'Delete blog',
			description: 'Delete a blog by its ID',
		},
	})
