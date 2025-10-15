import { z } from 'zod'

/**
 * Flat field selection for a single object.
 * Only allows keys provided by allowedFields (opt-in).
 */
export function createSelectQuery<T extends z.ZodRawShape>(allowedFields: z.ZodObject<T>) {
	return z.object({
		select: z.array(allowedFields.keyof()).optional().default([]).describe('Fields to include in response'),
	})
}

export type SelectQuery<T extends z.ZodRawShape> = z.infer<ReturnType<typeof createSelectQuery<T>>>
