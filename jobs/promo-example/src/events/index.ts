import type { MessageFor, QueueBindingsMap } from '@workspace/rabbitmq-helper'
import { onEmail } from './email'
import { onPush } from './push'
import { onAnalytics } from './analytics'

type EmailHandler = (msg: MessageFor<QueueBindingsMap['email.queue']>) => Promise<void>
type PushHandler = (msg: MessageFor<QueueBindingsMap['push.queue']>) => Promise<void>
type AnalyticsHandler = (msg: MessageFor<QueueBindingsMap['analytics.queue']>) => Promise<void>

const emailHandler: EmailHandler = async (msg) => onEmail(msg)
const pushHandler: PushHandler = async (msg) => onPush(msg)
const analyticsHandler: AnalyticsHandler = async (msg) => onAnalytics(msg)

export const consumers = [
	{ queue: 'email.queue' as const, handler: emailHandler },
	{ queue: 'push.queue' as const, handler: pushHandler },
	{ queue: 'analytics.queue' as const, handler: analyticsHandler },
]
