import type { Cron } from 'croner'
import { z } from 'zod'

// Request/Response models
export const cronJobName = z.string().min(1)
export const cronJobNameParam = z.object({ name: cronJobName })

// Types
export type CronJobName = z.infer<typeof cronJobName>
export type CronJobNameParam = z.infer<typeof cronJobNameParam>

export type CronStore<Name extends string = string> = Record<Name, Cron>
