import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: './.migrations/auth',
	schema: './src/auth/drizzle.schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		url: process.env['AUTH_DATABASE_URL']!,
	},
})
