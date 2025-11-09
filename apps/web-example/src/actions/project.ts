'use server'

import z from 'zod'

import { projectSchema } from '@/app/form/_schemas/project'

export async function createProject(unsafeData: z.infer<typeof projectSchema>) {
	const data = projectSchema.safeParse(unsafeData)

	if (!data.success) return { success: false }

	// Save to DB

	return { success: true }
}
