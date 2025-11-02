import { clientEnv } from './env'

/**
 * Playwright Global Setup
 * 
 * Verifies prerequisites before running any tests:
 * 1. Next.js app is accessible
 * 2. API server is accessible
 * 
 * If any prerequisite fails, the test suite will exit with an error.
 */
export default async function globalSetup() {
	const appUrl = clientEnv.NEXT_PUBLIC_BASE_URL
	const apiUrl = clientEnv.NEXT_PUBLIC_EXAMPLE_API_URL

	// Check Next.js app is running
	try {
		const response = await fetch(appUrl)
		if (!response.ok) throw new Error()
		console.log(`✅ Next.js app is accessible at ${appUrl}`)
	} catch {
		console.error(`❌ Next.js app is not running at ${appUrl}`)
		console.error(`   Start it with: pnpm dev`)
		throw new Error('Next.js app is not accessible')
	}

	// Check API server is running
	try {
		const response = await fetch(`${apiUrl}/health`)
		const data = await response.json()
		if (data.status !== 'ok') throw new Error()
		console.log(`✅ API server is accessible at ${apiUrl}/health`)
	} catch {
		console.error(`❌ API server is not running at ${apiUrl}/health`)
		console.error(`   Start it with: pnpm --filter server-example dev`)
		throw new Error('API server is not accessible')
	}

	console.log('✅ All prerequisites met - tests will run')
}
