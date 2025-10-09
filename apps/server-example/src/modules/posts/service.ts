import { mergeWith } from 'lodash-es'

import { AuthorizationError } from '@/errors/authorization'
import { InvariantError } from '@/errors/invariant'
import type * as PostModel from './model'

const dummyPosts: PostModel.Post[] = [
	{
		id: 'post_1',
		title: 'Getting Started with ElysiaJS',
		content: 'ElysiaJS is a fast and modern web framework for Bun...',
		authorId: 'user_1',
		published: true,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: 'post_2',
		title: 'MVC Pattern Best Practices',
		content: 'Learn how to structure your application using MVC pattern...',
		authorId: 'user_2',
		published: true,
		createdAt: '2024-01-02T00:00:00Z',
		updatedAt: '2024-01-02T00:00:00Z',
	},
	{
		id: 'post_3',
		title: 'Draft Post',
		content: 'This is a draft post that is not published yet...',
		authorId: 'user_1',
		published: false,
		createdAt: '2024-01-03T00:00:00Z',
		updatedAt: '2024-01-03T00:00:00Z',
	},
]

function generatePostId(): string {
	return `post_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

export function createPost(authorId: string, data: PostModel.CreatePostBody): PostModel.CreatePostResponse {
	const newPost: PostModel.Post = {
		id: generatePostId(),
		title: data.title,
		content: data.content,
		authorId,
		published: data.published ?? false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}

	dummyPosts.push(newPost)

	return newPost
}

export function getPostById(postId: string): PostModel.Post {
	const post = dummyPosts.find((p) => p.id === postId)

	if (!post) {
		throw new InvariantError('Post not found')
	}

	return post
}

export function updatePost(
	postId: string,
	authorId: string,
	data: PostModel.UpdatePostBody
): PostModel.UpdatePostResponse {
	const postIndex = dummyPosts.findIndex((p) => p.id === postId)

	if (postIndex === -1) {
		throw new InvariantError('Post not found')
	}

	const post = dummyPosts[postIndex]

	// Check if user is the author
	if (post?.authorId !== authorId) {
		throw new AuthorizationError('You are not authorized to update this post')
	}

	const updatedPost = mergeWith(
		post,
		data,
		{ updatedAt: new Date().toISOString() },
		(objValue, srcValue) => srcValue ?? objValue
	)

	dummyPosts[postIndex] = updatedPost

	return updatedPost
}

export function deletePost(postId: string, authorId: string): void {
	const postIndex = dummyPosts.findIndex((p) => p.id === postId)

	if (postIndex === -1) {
		throw new InvariantError('Post not found')
	}

	const post = dummyPosts[postIndex]

	// Check if user is the author
	if (post?.authorId !== authorId) {
		throw new AuthorizationError('You are not authorized to delete this post')
	}

	dummyPosts.splice(postIndex, 1)
}

export function listPosts(query: PostModel.ListPostsQuery): PostModel.ListPostsResponse {
	const { page = 1, limit = 10, published, authorId } = query

	let filteredPosts = dummyPosts

	// Apply published filter
	if (published !== undefined) {
		filteredPosts = filteredPosts.filter((p) => p.published === published)
	}

	// Apply author filter
	if (authorId) {
		filteredPosts = filteredPosts.filter((p) => p.authorId === authorId)
	}

	// Apply pagination
	const startIndex = (page - 1) * limit
	const endIndex = startIndex + limit
	const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

	return {
		posts: paginatedPosts,
		total: filteredPosts.length,
		page,
		limit,
	}
}
