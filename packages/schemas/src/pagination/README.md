# @packages/schemas

Shared Zod schemas for consistent API validation across the monorepo.

## Pagination

Two pagination strategies for different use cases:

### Offset-Based Pagination

**When to use:** Standard paginated lists, when users need page numbers (1, 2, 3...)

**Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Example:**

```typescript
import { paginationQuery, createPaginatedResponse } from '@packages/schemas'

export const listProductsQuery = z.object({
  ...paginationQuery.shape,
  category: z.string().optional(),
})

export const listProductsResponse = createPaginatedResponse(productSchema)

// Request: GET /products?page=2&limit=20
// Response: { data: [...], meta: { page: 2, limit: 20, total: 100 } }
```

**Frontend helper:**

```typescript
import { getPaginationHelpers } from '@packages/schemas'

const { totalPages, hasNextPage, hasPreviousPage } = getPaginationHelpers(meta)
```

### Cursor-Based Pagination

**When to use:** Large datasets, infinite scroll, real-time feeds

**Parameters:**

- `cursor` - Last item from previous page (optional)
- `order` - Sort direction: `asc` or `desc` (default: asc)
- `limit` - Items per page (default: 10, max: 100)

**Example:**

```typescript
import { cursorPaginationQuery, createCursorPaginatedResponse } from '@packages/schemas'

export const listActivityQuery = z.object({
  ...cursorPaginationQuery.shape,
  type: z.string().optional(),
})

export const listActivityResponse = createCursorPaginatedResponse(activitySchema)

// First page: GET /activity?limit=10
// Response: { data: [1,2,3,...,10], meta: { limit: 10, hasNextPage: true, hasPreviousPage: false } }

// Next page: GET /activity?cursor=10&limit=10
// Response: { data: [11,12,13,...,17], meta: { limit: 10, hasNextPage: false, hasPreviousPage: true } }
```

**Frontend usage:**

```typescript
const { data, meta } = response

// Use meta flags to show/hide navigation buttons
if (meta.hasNextPage) {
  const lastCursor = data.at(-1)?.id
  showNextButton(() => fetchNext({ cursor: lastCursor, order: 'asc', limit: meta.limit }))
}

if (meta.hasPreviousPage) {
  const firstCursor = data[0]?.id
  showPreviousButton(() => fetchPrevious({ cursor: firstCursor, order: 'desc', limit: meta.limit }))
}
```

**Key implementation notes:**

- Server returns `hasNextPage` and `hasPreviousPage` based on data availability
- Typically: fetch `limit + 1` items, if you get more than `limit`, there's a next page
- Server should return 404 if no data exists
- Cursor is EXCLUSIVE: use `WHERE id > cursor` (not `>=`)
- Always index cursor columns for performance

### Comparison

| Feature | Offset | Cursor |
|---------|--------|--------|
| Jump to page N | ✅ | ❌ |
| Performance (large data) | ⚠️ Slow | ✅ Fast |
| No duplicates on data changes | ❌ | ✅ |
| Implementation complexity | ✅ Simple | ⚠️ Complex |
