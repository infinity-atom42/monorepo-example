import process from 'node:process'
import { createEventBus } from '@workspace/event-bus'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'
const SERVICE_NAME = process.env['SERVICE_NAME'] || 'publisher-example'
const EXCHANGE_NAME = process.env['EXCHANGE_NAME'] || 'order-exchange'

async function main(): Promise<void> {
    const bus = createEventBus({
        url: RABBITMQ_URL,
        exchangeName: EXCHANGE_NAME,
        appId: SERVICE_NAME,
    })

    // Example publishes with strong typing
    await bus.publish('orders.created', {
        orderId: 'ord_123',
        userId: 'usr_456',
        amount: 4999,
        items: [
            { productId: 'prod_a', quantity: 1, price: 2999 },
            { productId: 'prod_b', quantity: 2, price: 1000 },
        ],
        createdAt: new Date().toISOString(),
    })

    await bus.publish('payments.succeeded', {
        paymentId: 'pay_789',
        orderId: 'ord_123',
        userId: 'usr_456',
        amount: 4999,
        currency: 'USD',
        method: 'card',
        timestamp: new Date().toISOString(),
    })

    await bus.publish('payments.created', {
        paymentId: 'pay_790',
        orderId: 'ord_124',
        userId: 'usr_789',
        amount: 2599,
        currency: 'USD',
        method: 'card',
        timestamp: new Date().toISOString(),
    })

    await bus.close()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
