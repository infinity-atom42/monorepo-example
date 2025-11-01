import { z } from 'zod'

// Request/Response models
export const cronJobName = z.string().min(1)
export const cronJobNameParam = z.object({ name: cronJobName })

// Types
export type CronJobName = z.infer<typeof cronJobName>
export type CronJobNameParam = z.infer<typeof cronJobNameParam>
