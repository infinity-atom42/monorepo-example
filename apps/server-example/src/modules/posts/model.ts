import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { createPaginatedQuery, createPaginatedResponse } from '@packages/schemas/query'

import { posts } from '@se/db/schema'

import { blog } from '../blogs/model'

// Field validation rules
const postRefinements = {
	title: (schema: z.ZodString) => schema.min(1).max(200),
	content: (schema: z.ZodString) => schema.min(1),
}

export const post = createSelectSchema(posts, postRefinements)

// query models
const sortable = post.pick({ title: true, createdAt: true, updatedAt: true })

const selectable = post.pick({
	id: true,
	title: true,
	content: true,
	published: true,
})

export const selectableFields = Object.keys(selectable.shape) as (keyof typeof selectable.shape)[]

const includable = {
	blog: blog.pick({
		id: true,
		name: true,
		createdAt: true,
		updatedAt: true,
	}),
}

const filterable = post.pick({
	published: true,
	blogId: true,
	createdAt: true,
	updatedAt: true,
})

// API request/response models
export const postId = post.shape.id
export const postIdParam = z.object({ postId: post.shape.id })
export const createPostBody = createInsertSchema(posts, postRefinements).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})
export const createPostResponse = post
export const updatePostBody = createPostBody.partial()
export const updatePostResponse = post
export const listPostsQuery = createPaginatedQuery({ sortable, selectable, includable, filterable })
export const listPostsResponse = createPaginatedResponse(post, { selectable, includable })

// API responses
export const errorNotFound = z.object({ message: z.literal('Post not found') })
export const successMessage = z.object({ message: z.string() })

// Types
export type Post = z.infer<typeof post>
export type PostId = z.infer<typeof postId>
export type PostIdParam = z.infer<typeof postIdParam>
export type CreatePostBody = z.infer<typeof createPostBody>
export type CreatePostResponse = z.infer<typeof createPostResponse>
export type UpdatePostBody = z.infer<typeof updatePostBody>
export type UpdatePostResponse = z.infer<typeof updatePostResponse>
export type ListPostsQuery = z.infer<typeof listPostsQuery>
export type ListPostsResponse = z.infer<typeof listPostsResponse>
