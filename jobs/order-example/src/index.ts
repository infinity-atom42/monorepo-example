import process from 'node:process'

import { broker } from './broker'
import { onOrderCreated } from './events/order-created'
import { onOrderFailed } from './events/order-failed'

broker.subscribe['orderQueue'].event['orderCreated'].handle(onOrderCreated)
broker.subscribe['orderQueue'].event['orderFailed'].handle(onOrderFailed)

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

console.log('\n✅ Order service is running')
