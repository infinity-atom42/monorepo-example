import process from 'node:process'

import { PubSub } from '@workspace/pub-sub'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

async function main(): Promise<void> {
	const pubSub = new PubSub(
		RABBITMQ_URL,
	)

	// Example publishes with strong typing
	await pubSub.publish(
		'orders',
		'orders.created',
		{
			orderId: 'ord_123',
		},
	)

	await pubSub.publish(
		'payments',
		'payments.succeeded',
		{
			paymentId: 'pay_789',
		},
	)

	// This should fail with a type error
	await pubSub.publish(
		'wrong',
		'wrong.event',
		{
			hello: 'world',
		},
	)

	await pubSub.close()
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
