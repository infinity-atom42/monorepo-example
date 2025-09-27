import eslintConfigPrettier from 'eslint-config-prettier'
import onlyWarn from 'eslint-plugin-only-warn'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'

import js from '@eslint/js'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const baseConfig = [
	js.configs.recommended,
	eslintConfigPrettier,
	...tseslint.configs.strict,
	{
		plugins: {
			turbo: turboPlugin,
		},
		rules: {
			'turbo/no-undeclared-env-vars': 'warn',
		},
	},
	{
		plugins: {
			onlyWarn,
		},
	},
	{
		rules: {
			// Safety and Security Rules
			eqeqeq: ['error', 'smart'], // Enforce strict equality (=== and !==)
			'no-eval': 'error', // Disallow eval()
			'no-implied-eval': 'error', // Disallow implied eval() (setTimeout/setInterval with strings)
			'no-new-func': 'error', // Disallow Function constructor
			'no-script-url': 'error', // Disallow javascript: URLs
			'no-unreachable-loop': 'error', // Disallow loops with a body that allows only one iteration

			// Code Quality and Safety
			'no-console': 'warn', // Disallow console statements (warn in dev, can be overridden)
			'no-var': 'error', // Require let or const instead of var
			'prefer-const': 'warn', // Require const declarations for variables that are never reassigned
			'no-duplicate-imports': 'error', // Disallow duplicate imports
			'no-unused-expressions': 'warn', // Disallow unused expressions
			'no-use-before-define': 'warn', // Disallow use before define
			'no-useless-assignment': 'error', // Disallow useless assignments
			'require-atomic-updates': 'error', // Disallow atomic updates
		},
	},
	{
		ignores: ['dist/**'],
	},
]
