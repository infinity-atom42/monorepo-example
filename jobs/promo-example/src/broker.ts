import { amqp } from '@workspace/amqp-orm'
import * as contract from '@workspace/shared/amqp-contract'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

export const broker = amqp({ url: RABBITMQ_URL, contract, heartbeatIntervalInSeconds: 5 })
