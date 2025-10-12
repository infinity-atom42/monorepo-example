import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { createPaginatedResponse, paginationQuery } from '@packages/schemas/pagination'

import { posts } from '@se/db/schema'

// Field validation rules
const postRefinements = {
	title: (schema: z.ZodString) => schema.min(1).max(200),
	content: (schema: z.ZodString) => schema.min(1),
}

// Base schemas for CRUD operations
const select = createSelectSchema(posts, postRefinements)
const insert = createInsertSchema(posts, postRefinements).omit({
	id: true,
	authorId: true,
	createdAt: true,
	updatedAt: true,
})
const update = insert.partial()

// API request/response models
export const post = select
export const postId = post.shape.id
export const postIdParam = z.object({ postId: post.shape.id })
export const createPostBody = insert
export const createPostResponse = post
export const updatePostBody = update
export const updatePostResponse = post
export const listPostsQuery = z.object({
	...paginationQuery.shape,
	published: z.boolean().optional(),
	authorId: z.string().optional(),
})
export const listPostsResponse = createPaginatedResponse(post)

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
