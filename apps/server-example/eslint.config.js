import drizzlePlugin from 'eslint-plugin-drizzle'

import { baseConfig } from '@packages/config/eslint/base'

/** @type {import("eslint").Linter.Config} */
export default [
	...baseConfig,
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
