import process from 'node:process'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'

async function gracefulShutdown(): Promise<void> {
	try {
		console.log('\n🧹 Starting cleanup...')

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
