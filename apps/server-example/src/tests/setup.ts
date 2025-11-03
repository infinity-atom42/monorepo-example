/**
 * Test Preload Script
 *
 * This script runs once before any tests load (configured in bunfig.toml).
 * It performs global test environment setup:
 *
 * 1. Check database connection - abort if unavailable
 * 2. Run migrations once globally
 * 3. Clean up any existing data
 *
 * Prerequisites:
 * - Test database must be running: `docker compose -f docker-compose.test.yml up -d`
 * - .env.test file must be configured with test database URLs
 */

import { resolve } from 'path'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

import { env } from '@se/env'

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🔧 Test Environment Setup (Preload)')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('📄 JUnit report: ./.test/junit-report.xml')

// Create a temporary pool for setup
const setupPool = new Pool({
	connectionString: env.DATABASE_URL,
})
const setupDb = drizzle({ client: setupPool })

// ============================================================================
// Step 1: Check if Database is Up
// ============================================================================

console.log('🔍 Checking if test database is up...')

// First, check if we can connect at all (TCP level)
try {
	const client = await setupPool.connect()
	client.release()
	console.log('✓ Test database is reachable')
} catch (error) {
	console.error('\n❌ Test database is DOWN')
	const errorMessage = error instanceof Error ? error.message : String(error)
	const errorCode = (error as { code?: string }).code
	console.error(`   Connection error: ${errorCode || errorMessage}`)
	console.error('\n💡 Make sure the test database is running:')
	console.error('   Run: docker compose -f docker-compose.test.yml up -d\n')
	await setupPool.end()
	process.exit(1) // Abort test run
}

// Then verify the database is actually working
try {
	console.log('🔍 Checking test database connection...')
	await setupDb.execute(sql`SELECT 1`)
	console.log('✓ Test database connection established')
} catch (error) {
	console.error('\n❌ Failed to query test database')
	console.error('   Error:', error)
	console.error('\n💡 Database is up but not responding correctly')
	await setupPool.end()
	process.exit(1) // Abort test run
}

// ============================================================================
// Step 2: Run Migrations
// ============================================================================

const migrationsFolder = resolve(process.cwd(), '.migrations')

try {
	const fs = await import('fs')
	if (!fs.existsSync(migrationsFolder)) {
		console.error('❌ No migrations folder found. Cannot start tests.')
		console.error('   Run "pnpm db:generate" to create migrations in ./.migrations.')
		await setupPool.end()
		process.exit(1)
	}

	await migrate(setupDb, { migrationsFolder })
	console.log('✓ Migrations completed')
} catch (error) {
	console.error('Failed to run migrations:', error)
	await setupPool.end()
	process.exit(1) // Abort test run
}

// ============================================================================
// Step 3: Clean Existing Data
// ============================================================================

try {
	// Get all tables excluding drizzle_migrations
	const result = await setupDb.execute(sql`
		SELECT string_agg(quote_ident(tablename), ', ') as table_list
		FROM pg_tables 
		WHERE schemaname = 'public' 
		AND tablename != 'drizzle_migrations'
	`)

	const tableList = result.rows[0]?.['table_list'] as string | null

	if (tableList) {
		// Truncate all tables in a single statement - fast and efficient
		// TRUNCATE is very fast even on empty tables, so no need to check first
		await setupDb.execute(sql.raw(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`))
		console.log('✓ Database cleaned and ready')
	}
} catch (error) {
	console.error('Warning: Failed to clean database:', error)
	console.error('         Continuing without auth cleanup (data may persist between tests).')
}

console.log('✓ Test database ready')

// Close the setup pool
await setupPool.end()

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('✅ Test Environment Ready - Starting Tests')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
