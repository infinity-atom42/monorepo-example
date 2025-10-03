import process from 'node:process'
import { createConnection, assertTopology, createPublisher } from '@workspace/rabbitmq-helper'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

const connection = createConnection(RABBITMQ_URL)

await assertTopology(connection)

const publish = createPublisher(connection)

await publish('order-exchange', 'order.created', { orderId: 'o1', userId: 'u1', total: 123 })
await publish('order-exchange', 'order.failed', { orderId: 'o2', reason: 'out_of_stock' })

await publish('payment-exchange', 'payment.created', { paymentId: 'p1', orderId: 'o1', amount: 123, currency: 'USD' })
await publish('payment-exchange', 'payment.succeeded', { paymentId: 'p1', orderId: 'o1', amount: 123, currency: 'USD' })
await publish('payment-exchange', 'payment.failed', { paymentId: 'p2', orderId: 'o2', reason: 'card_declined' })
