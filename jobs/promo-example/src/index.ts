import process from 'node:process'

import { broker } from './broker'
import { onAnalytics } from './queues/analytics'
import { onEmail } from './queues/email'
import { onPush } from './queues/push'

broker.subscribe['emailQueue'].handle(onEmail)
broker.subscribe['pushQueue'].handle(onPush)
broker.subscribe['analyticsQueue'].handle(onAnalytics)

async function gracefulShutdown(): Promise<void> {
	try {
		console.log('\n🧹 Starting cleanup...')
		await broker.disconnect()
		console.log('✅ Cleanup completed')
		process.exit(0)
	} catch (error) {
		console.error('❌ Error during cleanup:', error)
		process.exit(1)
	}
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

console.log('\n✅ Promo service is running and listening to email/push/analytics queues')
