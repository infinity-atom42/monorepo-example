import { eq } from 'drizzle-orm'

import db from '@se/db'
import { blogs, posts } from '@se/db/schema'
import { NotFoundError } from '@se/errors'

import type * as PostModel from './model'
import { selectableFields } from './model'
import { createListQueryBuilder } from './query-builders'

export async function createPost(data: PostModel.CreatePostBody): Promise<PostModel.CreatePostResponse> {
	const [post] = await db.insert(posts).values(data).returning()

	if (!post) {
		throw new NotFoundError('Post not found')
	}
	return post
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

// Create the list query builder for posts
const listPostsQueryBuilder = createListQueryBuilder({
	table: posts,
	selectableFields,
	relations: {
		blog: {
			relationKey: 'blog',
			table: blogs,
			joinCondition: eq(posts.blogId, blogs.id),
		},
		// Add more relations here as needed
		// user: {
		//   relationKey: 'user',
		//   table: users,
		//   joinCondition: eq(posts.userId, users.id),
		// },
	},
})

export async function listPosts(query: PostModel.ListPostsQuery): Promise<PostModel.ListPostsResponse> {
	type PostResponseItem = PostModel.ListPostsResponse['data'][number]
	
	const result = await listPostsQueryBuilder<PostResponseItem>({
		page: query.page,
		limit: query.limit,
		select: query.select,
		sort: query.sort,
		filter: query.filter,
		include: query.include,
	})
	
	return {
		data: result.data,
		meta: result.meta,
	}
}
