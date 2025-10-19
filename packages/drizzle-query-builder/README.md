# @packages/drizzle-query-builder

Reusable Drizzle ORM query builders for PostgreSQL with support for:

- ✅ Pagination
- ✅ Filtering (with operators: eq, ne, gt, gte, lt, lte, in, nin, like, ilike)
- ✅ Sorting (multi-field with index)
- ✅ Field selection (dynamic select)
- ✅ Relations (includes/joins)

## Usage

```typescript
import { createListQueryBuilder } from '@packages/drizzle-query-builder'
import { eq } from 'drizzle-orm'
import db from './db'
import { posts, blogs } from './schema'

// Create a list query builder for posts
const listPostsQueryBuilder = createListQueryBuilder({
  db,
  table: posts,
  selectableFields: ['id', 'title', 'content', 'blogId'],
  relations: {
    blog: {
      relationKey: 'blog',
      table: blogs,
      joinCondition: eq(posts.blogId, blogs.id),
    },
  },
})

// Use it in your service
const result = await listPostsQueryBuilder({
  page: 1,
  limit: 10,
  select: ['title', 'content'],
  sort: {
    createdAt: { order: 'desc', index: 0 },
  },
  filter: {
    published: { eq: true },
  },
  include: {
    blog: ['id', 'name'],
  },
})
```

## Features

### Dynamic Field Selection

- Specify which fields are optional vs always required
- If `selectableFields` is not provided, all fields are always returned

### Advanced Filtering

Supports multiple operators per field:

- `eq`, `ne` - Equality/inequality
- `gt`, `gte`, `lt`, `lte` - Comparisons
- `in`, `nin` - Array membership
- `like`, `ilike` - Pattern matching

### Multi-field Sorting

Sort by multiple fields with explicit ordering using `index`.

### Type-Safe Relations

Include related data with automatic joins and field selection.

## Architecture

- **Model-agnostic**: Works with any PostgreSQL table
- **Type-safe**: Full TypeScript support with generics
- **Reusable**: Share across multiple apps in your monorepo
- **Validated**: Works seamlessly with `@packages/schemas` Zod validators
