import { betterAuth, type Auth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { jwt, openAPI } from 'better-auth/plugins'

import db from './db'

import * as schema from '~/auth-schema'

export const auth: Auth = betterAuth({
	appName: process.env['APP_NAME']!,
	// disabledPaths: ['/token'],
	plugins: [
		openAPI(),
		nextCookies(),
		// jwt({
		// 	disableSettingJwtHeader: true,
		// }),
	],
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: process.env['GITHUB_CLIENT_ID']!,
			clientSecret: process.env['GITHUB_CLIENT_SECRET']!,
		},
	},
})
