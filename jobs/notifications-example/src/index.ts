import process from 'node:process'

import { notificationsQueue, orderFailed, paymentFailed } from '@workspace/shared/amqp-contract'

import { broker } from './broker'
import { onOrderFailed } from './events/order-failed'
import { onPaymentFailed } from './events/payment-failed'

broker.subscribe(notificationsQueue).event(orderFailed).handle(onOrderFailed)
broker.subscribe(notificationsQueue).event(paymentFailed).handle(onPaymentFailed)

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

console.log('\n✅ Notifications service is running')
