import process from 'node:process'

async function start() {
	// Setup graceful shutdown
	for (const signal of ['SIGINT', 'SIGTERM'] as const) {
		process.on(signal, () => {
			console.log(`Received ${signal}, shutting down gracefully...`)
		})
	}

	console.log('✅ job-example is running')
}

void start().catch((error) => {
	console.error('Failed to start job-example consumer', { error })
	process.exit(1)
})
