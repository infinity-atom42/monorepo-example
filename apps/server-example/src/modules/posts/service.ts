import { count, eq } from 'drizzle-orm'

import db from '@se/db'
import { posts } from '@se/db/schema'
import { NotFoundError } from '@se/errors'

import type * as PostModel from './model'

export async function createPost(data: PostModel.CreatePostBody): Promise<PostModel.CreatePostResponse> {
	const [post] = await db.insert(posts).values(data).returning()

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return post!
}

export async function getPostById(postId: PostModel.PostId): Promise<PostModel.Post> {
	const [post] = await db.select().from(posts).where(eq(posts.id, postId))

	if (!post) {
		throw new NotFoundError('Post not found')
	}

	return post
}

export async function updatePost(
	postId: PostModel.PostId,
	data: PostModel.UpdatePostBody
): Promise<PostModel.UpdatePostResponse> {
	const [post] = await db.update(posts).set(data).where(eq(posts.id, postId)).returning()

	if (!post) {
		throw new NotFoundError('Post not found')
	}

	return post
}

export async function deletePost(postId: PostModel.PostId): Promise<void> {
	const [post] = await db.delete(posts).where(eq(posts.id, postId)).returning()

	if (!post) {
		throw new NotFoundError('Post not found')
	}
}

export async function listPosts(query: PostModel.ListPostsQuery): Promise<PostModel.ListPostsResponse> {
	const page = query.page
	const limit = query.limit
	const offset = (page - 1) * limit

	// const where = query.select
	// const orderBy = query.sort
	// Page rows
	const rows = await db
		.select({
			id: posts.id,
			title: posts.title,
			content: posts.content,
			blogId: posts.blogId,
			published: posts.published,
			createdAt: posts.createdAt,
			updatedAt: posts.updatedAt,
		})
		.from(posts)
		// .where(query.filter)
		// .orderBy(query.sort)
		.limit(limit)
		.offset(offset)

	// Total count
	const [result] = await db
		.select({ total: count() })
		.from(posts)
	
	const total = result?.total ?? 0 // TODO: implement a better way to get the total count

	return {
		data: rows,
		meta: {
			page,
			limit,
			total,
		},
	}
}
