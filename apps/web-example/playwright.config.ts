import { defineConfig } from '@playwright/test'

import { basePlaywrightConfig } from '@packages/config/playwright/base'

const BASE_URL = process.env['NEXT_PUBLIC_BASE_URL']
const API_URL = process.env['NEXT_PUBLIC_EXAMPLE_API_URL']

if (!BASE_URL) {
	throw new Error('NEXT_PUBLIC_BASE_URL must be defined for Playwright tests')
}

if (!API_URL) {
	throw new Error('NEXT_PUBLIC_EXAMPLE_API_URL must be defined for Playwright tests')
}
const { webServer: baseWebServer, ...baseConfig } = basePlaywrightConfig(BASE_URL)

if (!baseWebServer) {
	throw new Error('Base Playwright config must define a webServer entry')
}

const baseWebServers = Array.isArray(baseWebServer) ? baseWebServer : [baseWebServer]

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	...baseConfig,
	webServer: [
		...baseWebServers,
		{
			command: 'pnpm --filter server-example dev:test',
			url: `${API_URL}/health`,
			reuseExistingServer: !process.env.CI,
			env: {
				E2E_TEST: 'true',
			},
			timeout: 10 * 1000,
		},
	],
})
