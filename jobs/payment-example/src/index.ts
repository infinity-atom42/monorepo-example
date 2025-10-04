import process from 'node:process'

import { paymentCreated, paymentFailed, paymentQueue, paymentSucceeded } from '@workspace/shared/amqp-contract'

import { broker } from './broker'
import { onPaymentCreated } from './events/payment-created'
import { onPaymentFailed } from './events/payment-failed'
import { onPaymentSucceeded } from './events/payment-succeeded'

broker.subscribe(paymentQueue).event(paymentCreated).handle(onPaymentCreated)
broker.subscribe(paymentQueue).event(paymentSucceeded).handle(onPaymentSucceeded)
broker.subscribe(paymentQueue).event(paymentFailed).handle(onPaymentFailed)

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

console.log('\n✅ Payment service is running')
