import { join } from 'node:path'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

import { clientEnv, serverEnv } from '@/env'

/**
 * Playwright Global Setup
 *
 * This script runs once before the Playwright test suite starts. It mirrors the
 * server test preload by preparing the auth database and verifying external
 * prerequisites:
 *
 * 1. Ensure auth migrations exist
 * 2. Check auth database connectivity
 * 3. Run auth migrations
 * 4. Clean auth database tables
 * 5. Verify Next.js app and API server
 */
export default async function globalSetup() {
	const appUrl = clientEnv.NEXT_PUBLIC_BASE_URL
	const apiUrl = clientEnv.NEXT_PUBLIC_EXAMPLE_API_URL
	const authMigrationsFolder = join(process.cwd(), '.migrations', 'auth')

	console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
	console.log('🔧 Playwright Global Setup (Preload)')
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

	console.log('AUTH_DATABASE_URL:', serverEnv.AUTH_DATABASE_URL)
	process.exit(1)

	// Create a temporary pool for auth setup
	const authPool = new Pool({
		connectionString: serverEnv.AUTH_DATABASE_URL,
	})
	const authDb = drizzle({ client: authPool })

	// ============================================================================
	// Step 1: Check if Auth Database is Up
	// ============================================================================
	console.log('🔍 Checking if auth database is up...')
	try {
		const client = await authPool.connect()
		client.release()
		await authDb.execute(sql`SELECT 1`)
		console.log('✓ Auth database connection established')
	} catch (error) {
		console.error('\n❌ Auth database is unavailable')
		console.error('   Error:', error)
		console.error('\n💡 Make sure the auth database is reachable and credentials are valid.')
		await authPool.end()
		process.exit(1)
	}

	// ============================================================================
	// Step 2: Run Auth Migrations
	// ============================================================================
	console.log('⚙ Running auth migrations...')
	try {
		const fs = await import('fs')
		if (!fs.existsSync(authMigrationsFolder)) {
			console.error('❌ No auth migrations folder found. Cannot start Playwright tests.')
			console.error('   Run "pnpm --filter web-example auth:migrate" to create migrations in ./.migrations/auth.')
			await authPool.end()
			process.exit(1)
		}
		await migrate(authDb, { migrationsFolder: authMigrationsFolder })
		console.log('✓ Auth migrations completed')
	} catch (error) {
		console.error('❌ Failed to run auth migrations:', error)
		await authPool.end()
		process.exit(1)
	}

	// ============================================================================
	// Step 3: Clean Auth Database Tables
	// ============================================================================
	console.log('🧼 Cleaning auth database tables...')
	try {
		const tableResult = await authDb.execute(sql`
			SELECT string_agg(quote_ident(tablename), ', ') as table_list
			FROM pg_tables
			WHERE schemaname = 'public'
			AND tablename != 'drizzle_migrations'
		`)
		const tableList = tableResult.rows[0]?.['table_list'] as string | null
		if (tableList) {
			await authDb.execute(sql.raw(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`))
		}
		console.log('✓ Auth database cleaned and ready')
	} catch (error) {
		console.error('Warning: Failed to clean auth database:', error)
		console.error('         Continuing without auth cleanup (data may persist between tests).')
	}

	await authPool.end()

	console.log('✓ Auth environment ready')

	// ============================================================================
	// Step 4: Verify Web Prerequisites
	// ============================================================================
	console.log('\n🔍 Verifying web prerequisites...')

	// Check Next.js app is running
	try {
		const response = await fetch(appUrl)
		if (!response.ok) throw new Error()
		console.log(`✓ Next.js app is accessible at ${appUrl}`)
	} catch {
		console.error(`❌ Next.js app is not running at ${appUrl}`)
		console.error('   Start it with: pnpm dev')
		process.exit(1)
	}

	// Check API server is running
	try {
		const response = await fetch(`${apiUrl}/health`)
		const data = await response.json()
		if (data.status !== 'ok') throw new Error()
		console.log(`✓ API server is accessible at ${apiUrl}/health`)
	} catch {
		console.error(`❌ API server is not running at ${apiUrl}/health`)
		console.error('   Start it with: pnpm --filter server-example dev')
		process.exit(1)
	}

	console.log('\n✅ Playwright prerequisites satisfied - starting tests')
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}
