import { z } from 'zod'

// Shared validation schema for unique arrays
export const uniqueArraySchema = z.array(z.any()).refine((items) => new Set(items).size === items.length, {
	message: 'All items must be unique, no duplicate values allowed',
})
