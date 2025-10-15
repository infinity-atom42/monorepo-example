import { eq } from 'drizzle-orm'

import db from '@se/db'
import { blogs } from '@se/db/schema'
import { NotFoundError } from '@se/errors'

import type * as BlogModel from './model'

export async function createBlog(data: BlogModel.CreateBlogBody): Promise<BlogModel.CreateBlogResponse> {
	const [blog] = await db.insert(blogs).values(data).returning()

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return blog!
}

export async function deleteBlog(blogId: BlogModel.BlogId): Promise<void> {
	const [blog] = await db.delete(blogs).where(eq(blogs.id, blogId)).returning()

	if (!blog) {
		throw new NotFoundError('Blog not found')
	}
}
