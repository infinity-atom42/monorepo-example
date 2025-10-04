import process from 'node:process'
import { amqp } from '@workspace/amqp-orm'
import * as contract from '@workspace/shared/amqp-contract'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

const broker = amqp({ url: RABBITMQ_URL, contract, heartbeatIntervalInSeconds: 5 })

await broker.publish('order-exchange', 'order.created', { orderId: 'o1', userId: 'u1', total: 123 })
await broker.publish('order-exchange', 'order.failed', { orderId: 'o2', reason: 'out_of_stock' })

await broker.publish('payment-exchange', 'payment.created', { paymentId: 'p1', orderId: 'o1', amount: 123, currency: 'USD' })
await broker.publish('payment-exchange', 'payment.succeeded', { paymentId: 'p1', orderId: 'o1', amount: 123, currency: 'USD' })
await broker.publish('payment-exchange', 'payment.failed', { paymentId: 'p2', orderId: 'o2', reason: 'card_declined' })
