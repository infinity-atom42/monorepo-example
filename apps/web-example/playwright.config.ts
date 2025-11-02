import { defineConfig, devices } from '@playwright/test'

const STORAGE_STATE_PATH = 'test/storage-state/.auth/default.json'
const BASE_URL = process.env['NEXT_PUBLIC_BASE_URL']

if (!BASE_URL) {
	throw new Error('NEXT_PUBLIC_BASE_URL must be defined for Playwright tests')
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './src',
	globalSetup: './src/playwright/global-setup.ts',
	outputDir: 'test/test-results',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: process.env.CI
		? 'github' // CI: GitHub annotations only (no HTML needed if no errors)
		: [['list'], ['html', { outputFolder: 'test/playwright-report' }]], // Local: terminal output + HTML report for debugging
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: BASE_URL,
		/* Collect trace when retrying the failed test (local only) */
		trace: process.env.CI ? 'off' : 'on-first-retry',
		/* Screenshot on failure (local only) */
		screenshot: process.env.CI ? 'off' : 'only-on-failure',
		/* Video on failure (local only) */
		video: process.env.CI ? 'off' : 'retain-on-failure',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'setup',
			testMatch: /.*\.setup\.ts/,
		},
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				storageState: STORAGE_STATE_PATH,
			},
			dependencies: ['setup'],
		},
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
				storageState: STORAGE_STATE_PATH,
			},
			dependencies: ['setup'],
		},
		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari'],
				storageState: STORAGE_STATE_PATH,
			},
			dependencies: ['setup'],
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'pnpm dev',
		url: BASE_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
})
