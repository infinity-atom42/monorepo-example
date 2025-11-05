"use server"

import { projectSchema } from "@/schemas/project"
import z from "zod"

export async function createProject(unsafeData: z.infer<typeof projectSchema>) {
  const data = projectSchema.safeParse(unsafeData)

  if (!data.success) return { success: false }

  // Save to DB

  return { success: true }
}
