/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq } from 'drizzle-orm'

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

export function listPosts(_query: PostModel.ListPostsQuery): PostModel.ListPostsResponse {
	return {
		data: [
			{
				id: '46633897-5768-4e72-9039-1858a4bd5bf5',
				title: 'title',
				content: 'content',
				blogId: '46633897-5768-4e72-9039-1858a4bd5bf5',
				published: true,
				createdAt: '2021-01-01',
				updatedAt: '2021-01-01',
			},
		],

		meta: {
			page: 1,
			limit: 10,
			total: 100,
		},
	}
}
