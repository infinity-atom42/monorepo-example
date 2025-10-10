import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://admin:admin@localhost:5672'
const isProduction = process.env['NODE_ENV'] === 'production'
let isShuttingDown = false

if (cluster.isPrimary) {
	console.log(`\n🚀 Order service is starting...`)
	console.log(`📡 RabbitMQ URL: ${RABBITMQ_URL}`)
	
	if (isProduction) {
		// In production, spawn multiple workers
		const numWorkers = os.availableParallelism()
		console.log(`Starting ${numWorkers} workers in production mode`)

		for (let i = 0; i < numWorkers; i++) {
			cluster.fork()
		}

		cluster.on('exit', (worker, code, signal) => {
			// Don't restart workers during shutdown
			if (!isShuttingDown) {
				console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}. Restarting...`)
				cluster.fork()
			}
		})
	} else {
		// In development, run single worker
		console.log('Starting single worker in development mode')
		cluster.fork()
	}

	// Graceful shutdown handler for primary process
	const shutdownPrimary = (signal: string) => {
		console.log(`\n${signal} received in primary process. Shutting down gracefully...`)
		isShuttingDown = true

		// Send shutdown signal to all workers
		for (const id in cluster.workers) {
			cluster.workers[id]?.kill('SIGTERM')
		}

		// Force exit if workers don't shut down within timeout
		const timeout = setTimeout(() => {
			console.log('Forcefully shutting down workers')
			for (const id in cluster.workers) {
				cluster.workers[id]?.kill('SIGKILL')
			}
			console.log('Forcefully shutting down primary process')
			process.exit(1)
		}, 10000) // 10 second timeout

		// Wait for all workers to exit
		let workersAlive = Object.keys(cluster.workers || {}).length
		cluster.on('exit', () => {
			workersAlive--
			if (workersAlive === 0) {
				clearTimeout(timeout)
				console.log('All workers shut down successfully')
				process.exit(0)
			}
		})
	}

	process.on('SIGTERM', () => shutdownPrimary('SIGTERM'))
	process.on('SIGINT', () => shutdownPrimary('SIGINT'))
} else {
	// Worker process
	const { connection, channel } = await import('./worker.ts')
	console.log(`Worker ${process.pid} started`)

	// Graceful shutdown handler for worker process
	const shutdownWorker = async () => {
		if (isShuttingDown) return
		isShuttingDown = true

		try {
			// Close AMQP channel and connection
			await channel.close()
			await connection.close()

			console.log(`Worker ${process.pid} shut down successfully`)
			process.exit(0)
		} catch (error) {
			console.error(`Worker ${process.pid} shutdown error:`, error)
			process.exit(1)
		}
	}

	process.on('SIGTERM', () => shutdownWorker())
	process.on('SIGINT', () => shutdownWorker())
}
