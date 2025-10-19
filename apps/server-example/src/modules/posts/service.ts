import { count, eq, getTableColumns } from 'drizzle-orm'

import db from '@se/db'
import { blogs, posts } from '@se/db/schema'
import { NotFoundError } from '@se/errors'

import type * as PostModel from './model'
import { buildOrderByClause, buildSelectWithInclude, buildWhereClause } from './query-builders'

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

export async function listPosts(query: PostModel.ListPostsQuery): Promise<PostModel.ListPostsResponse> {
	const page = query.page
	const limit = query.limit
	const offset = (page - 1) * limit

	const postsColumns = getTableColumns(posts)

	// Build WHERE clause from filters
	const whereClause = buildWhereClause({
		filter: query.filter,
		columns: postsColumns,
	})

	// Build ORDER BY clause from sort
	const orderByClause = buildOrderByClause({
		sort: query.sort,
		columns: postsColumns,
	})

	// Build SELECT clause with includes
	const includeBlog = query.include?.blog && query.include.blog.length > 0
	const selectClause = buildSelectWithInclude({
		select: query.select,
		mainColumns: postsColumns,
		selectableFields: ['id', 'title', 'content', 'blogId'],
		include:
			includeBlog && query.include?.blog
				? {
						relationKey: 'blog',
						fields: query.include.blog,
						relationTable: blogs,
					}
				: undefined,
	})

	// Build the main query
	let baseQuery

	// Add join if including blog
	if (includeBlog) {
		baseQuery = db.select(selectClause).from(posts).leftJoin(blogs, eq(posts.blogId, blogs.id)).$dynamic()
	} else {
		baseQuery = db.select(selectClause).from(posts).$dynamic()
	}

	// Add WHERE clause
	if (whereClause) {
		baseQuery = baseQuery.where(whereClause)
	}

	// Add ORDER BY clause
	if (orderByClause.length > 0) {
		baseQuery = baseQuery.orderBy(...orderByClause)
	}

	// Add pagination
	baseQuery = baseQuery.limit(limit).offset(offset)

	// Execute query
	const data = await baseQuery

	// Get total count
	let countQuery = db.select({ count: count() }).from(posts).$dynamic()

	if (whereClause) {
		countQuery = countQuery.where(whereClause)
	}

	const [countResult] = await countQuery
	const total = countResult?.count ?? 0

	return {
		data: data as unknown as PostModel.ListPostsResponse['data'],
		meta: {
			page,
			limit,
			total,
		},
	}
}
