import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { blogs } from '@se/db/schema'

const refinements = {
	name: (schema: z.ZodString) => schema.min(1).max(200),
}

const select = createSelectSchema(blogs, refinements)
const insert = createInsertSchema(blogs, refinements).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export const blog = select
export const blogId = blog.shape.id
export const blogIdParam = z.object({ blogId: blog.shape.id })
export const createBlogBody = insert
export const createBlogResponse = blog
export const successMessage = z.object({ message: z.string() })

export type Blog = z.infer<typeof blog>
export type BlogId = z.infer<typeof blogId>
export type BlogIdParam = z.infer<typeof blogIdParam>
export type CreateBlogBody = z.infer<typeof createBlogBody>
export type CreateBlogResponse = z.infer<typeof createBlogResponse>
