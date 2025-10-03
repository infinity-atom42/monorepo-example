import { onAnalytics } from './analytics'
import { onEmail } from './email'
import { onPush } from './push'

export const queues = [onEmail, onPush, onAnalytics]
