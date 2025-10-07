import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'
import { env } from '@/env'

const isProduction = env.NODE_ENV === 'production'

if (cluster.isPrimary) {
	if (isProduction) {
		// In production, spawn multiple workers
		const numWorkers = os.availableParallelism()
		console.log(`Starting ${numWorkers} workers in production mode`)

		for (let i = 0; i < numWorkers; i++) {
			cluster.fork()
		}

		cluster.on('exit', (worker, code, signal) => {
			console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}. Restarting...`)
			cluster.fork()
		})
	} else {
		// In development, run single worker
		console.log('Starting single worker in development mode')
		cluster.fork()
	}
} else {
	await import('./server.ts')
	console.log(`Worker ${process.pid} started`)
}
