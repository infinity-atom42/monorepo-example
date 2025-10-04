import process from 'node:process'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'