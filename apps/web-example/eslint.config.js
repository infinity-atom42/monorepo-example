import drizzlePlugin from 'eslint-plugin-drizzle'

import { nextJsConfig } from '@packages/eslint-config/next-js'

/** @type {import("eslint").Linter.Config} */
export default [
	...nextJsConfig,
	{
		plugins: {
			drizzle: drizzlePlugin,
		},
		rules: {
			'drizzle/enforce-delete-with-where': ['error', { drizzleObjectName: ['db'] }],
			'drizzle/enforce-update-with-where': ['error', { drizzleObjectName: ['db'] }],
		},
	},
]
