import pluginNext from '@next/eslint-plugin-next'

import { reactInternalConfig } from './react-internal.js'

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
	...reactInternalConfig,
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
