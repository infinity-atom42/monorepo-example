/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	// Line and formatting
	printWidth: 120,
	tabWidth: 2,
	useTabs: true,
	endOfLine: 'lf',

	// Syntax
	semi: false,
	singleQuote: true,
	trailingComma: 'all',
	bracketSpacing: true,
	bracketSameLine: true,

	// HTML/Markup
	singleAttributePerLine: true,
	htmlWhitespaceSensitivity: 'ignore',
	proseWrap: 'preserve',

	overrides: [
		{
			files: ['*.md', '*.mdx'],
			options: {
				useTabs: false,
			},
		},
	],
	plugins: [
		'prettier-plugin-organize-imports',
		'prettier-plugin-packagejson',
		'prettier-plugin-nginx',
		'prettier-plugin-sh',
		'prettier-plugin-sql',
		'prettier-plugin-tailwindcss',
	],
}

export default config
