import { z } from 'zod'

// Post entity
export const post = z.object({
	id: z.string(),
	title: z.string(),
	content: z.string(),
	authorId: z.string(),
	published: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
})
export type Post = z.infer<typeof post>

// Create post
export const createPostBody = z.object({
	title: z.string().min(1).max(200),
	content: z.string().min(1),
	published: z.boolean().default(false).optional(),
})
export type CreatePostBody = z.infer<typeof createPostBody>

export const createPostResponse = post
export type CreatePostResponse = z.infer<typeof createPostResponse>

// Update post
export const updatePostBody = z.object({
	title: z.string().min(1).max(200).optional(),
	content: z.string().min(1).optional(),
	published: z.boolean().optional(),
})
export type UpdatePostBody = z.infer<typeof updatePostBody>

export const updatePostResponse = post
export type UpdatePostResponse = z.infer<typeof updatePostResponse>

// List posts
export const listPostsQuery = z.object({
	page: z.coerce.number().min(1).default(1).optional(),
	limit: z.coerce.number().min(1).max(100).default(10).optional(),
	published: z
		.string()
		.transform((val) => val === 'true')
		.optional(),
	authorId: z.string().optional(),
})
export type ListPostsQuery = z.infer<typeof listPostsQuery>

export const listPostsResponse = z.object({
	posts: z.array(post),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
})
export type ListPostsResponse = z.infer<typeof listPostsResponse>

// Post ID param
export const postIdParam = z.object({
	id: z.string(),
})
export type PostIdParam = z.infer<typeof postIdParam>

// Post with author
export const postWithAuthor = post.extend({
	author: z.object({
		id: z.string(),
		username: z.string(),
		email: z.email(),
	}),
})
export type PostWithAuthor = z.infer<typeof postWithAuthor>

// Error responses
export const errorNotFound = z.object({ message: z.literal('Post not found') })
export const errorUnauthorized = z.object({ message: z.string() })
export const successMessage = z.object({ message: z.string() })
