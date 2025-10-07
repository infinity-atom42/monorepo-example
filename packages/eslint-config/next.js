import pluginNext from '@next/eslint-plugin-next'
import pluginQuery from '@tanstack/eslint-plugin-query'

import { reactInternalConfig } from './react-internal.js'

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
	...reactInternalConfig,
	...pluginQuery.configs['flat/recommended'],
	{
		plugins: {
			'@next/next': pluginNext,
		},
		rules: {
			...pluginNext.configs.recommended.rules,
			...pluginNext.configs['core-web-vitals'].rules,
		},
	},
	{
		ignores: ['.next/**', 'next-env.d.ts'],
	},
]
