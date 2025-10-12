import { baseConfig } from '@packages/config/eslint/base'

/**
 * Root ESLint configuration for the monorepo.
 * This configuration applies to the root directory and files that don't belong to specific packages.
 * @type {import("eslint").Linter.Config}
 */
export default [
	...baseConfig,
	{
		ignores: ['apps/**', 'packages/**'],
	},
]
