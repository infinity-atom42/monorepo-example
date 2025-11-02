import { defineConfig } from '@playwright/test'

import { basePlaywrightConfig } from '@packages/config/playwright/base'

const BASE_URL = process.env['NEXT_PUBLIC_BASE_URL']

if (!BASE_URL) {
	throw new Error('NEXT_PUBLIC_BASE_URL must be defined for Playwright tests')
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	...basePlaywrightConfig(BASE_URL),
	// App-specific overrides can go here if needed
})
