import amqp, {
	type AmqpConnectionManager,
	type ChannelWrapper,
} from 'amqp-connection-manager'
import type { Channel, ConsumeMessage } from 'amqplib'

interface RabbitMQConfig {
	url: string
	exchangeName: string
	exchangeType: 'direct' | 'topic' | 'headers' | 'fanout' | 'match'
}

class RabbitMQService {
	private connection: AmqpConnectionManager
	private channel: ChannelWrapper
	private exchangeName: string

	constructor(config: RabbitMQConfig) {
		this.exchangeName = config.exchangeName
		console.log('📡 Initializing RabbitMQ connection...')

		// Create connection manager (returns immediately, connects in background)
		this.connection = amqp.connect(config.url, {
			heartbeatIntervalInSeconds: 30,
			reconnectTimeInSeconds: 10,
		})

		// Connection event handlers
		this.connection.on('connect', () => {
			console.log('✅ Connected to RabbitMQ')
		})

		this.connection.on('disconnect', (params: { err: Error }) => {
			console.warn('⚠️ Disconnected from RabbitMQ:', params.err?.message)
		})

		this.connection.on(
			'connectFailed',
			(params: { err: Error; url?: string }) => {
				console.error('❌ Connection failed:', params.err?.message)
			}
		)

		// Create channel wrapper
		this.channel = this.connection.createChannel({
			setup: async (channel: Channel) => {
				// Assert exchange exists
				await channel.assertExchange(
					config.exchangeName,
					config.exchangeType,
					{
						durable: true,
					}
				)

				// Set prefetch (process one message at a time)
				await channel.prefetch(1)

				console.log(`✅ RabbitMQ channel ready (Exchange: ${config.exchangeName})`)
			},
		})
	}

	async subscribe(
		queueName: string,
		routingKey: string,
		handler: (message: unknown) => Promise<void>
	): Promise<void> {
		// Use addSetup to register this subscription
		// It will be called immediately AND on every reconnect
		await this.channel.addSetup(async (channel: Channel) => {
			// Assert queue exists
			await channel.assertQueue(queueName, {
				durable: true,
			})

			// Bind queue to exchange with routing key
			await channel.bindQueue(queueName, this.exchangeName, routingKey)

			console.log(`🎧 Listening to queue: ${queueName} (routing key: ${routingKey})`)

			// Consume messages
			await channel.consume(queueName, async (msg: ConsumeMessage | null) => {
				if (!msg) return

				try {
					const content = JSON.parse(msg.content.toString())
					console.log(`📨 Received message on ${queueName}:`, content)

					await handler(content)

					// Acknowledge message
					channel.ack(msg)
				} catch (error) {
					console.error(`❌ Error processing message on ${queueName}:`, error)
					// Reject and requeue the message
					channel.nack(msg, false, true)
				}
			})
		})
	}

	async close(): Promise<void> {
		try {
			await this.connection.close()
			console.log('🔌 RabbitMQ connection closed')
		} catch (error) {
			console.error('❌ Error closing RabbitMQ connection:', error)
		}
	}
}

export default RabbitMQService
