/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotImplementedError } from '@se/errors'
import type * as PostModel from './model'

export function createPost(_authorId: string, _data: PostModel.CreatePostBody): PostModel.CreatePostResponse {
	throw new NotImplementedError('createPost')
}

export function getPostById(_postId: PostModel.PostId): PostModel.Post {
	throw new NotImplementedError('getPostById')
}

export function updatePost(_postId: PostModel.PostId, _data: PostModel.UpdatePostBody): PostModel.UpdatePostResponse {
	throw new NotImplementedError('updatePost')
}

export function deletePost(_postId: PostModel.PostId): void {
	throw new NotImplementedError('deletePost')
}

export function listPosts(_query: PostModel.ListPostsQuery): PostModel.ListPostsResponse {
	throw new NotImplementedError('listPosts')
}
