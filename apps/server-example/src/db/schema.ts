import { boolean, decimal, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// Blogs table
export const blogs = pgTable(
	'blogs',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: text('name').notNull(),
		artiom: text('artiom').notNull(),
		createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'string' })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date().toISOString()),
	}
)

// Posts table
export const posts = pgTable(
	'posts',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		title: text('title').notNull(),
		content: text('content').notNull(),
		blogId: uuid('blog_id')
			.notNull()
			.references(() => blogs.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		published: boolean('published').notNull().default(false),
		createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'string' })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date().toISOString()),
	},
	(table) => [index('posts_published_idx').on(table.published), index('posts_blog_id_idx').on(table.blogId)]
)

// Products table
export const products = pgTable(
	'products',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		price: decimal('price', { precision: 10, scale: 2 }).notNull(),
		sku: text('sku').notNull().unique(),
		inStock: boolean('in_stock').notNull().default(true),
		category: text('category').notNull(),
		createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'string' })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date().toISOString()),
	},
	(table) => [
		index('products_sku_idx').on(table.sku),
		index('products_category_idx').on(table.category),
		index('products_in_stock_idx').on(table.inStock),
	]
)
