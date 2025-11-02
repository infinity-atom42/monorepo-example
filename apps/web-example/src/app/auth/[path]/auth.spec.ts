import { randomUUID } from 'node:crypto'

import { expect, test } from '@playwright/test'

import { serverEnv } from '@/env'

// Ensure this suite starts unauthenticated instead of reusing the shared storage state
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Auth Sign In', () => {
	test('allows an existing user to sign in with email and password', async ({ page }) => {
		await page.goto('/auth/sign-in')

		await page.getByLabel('Email').fill(serverEnv.DEFAULT_USER_EMAIL)
		await page.getByLabel('Password', { exact: true }).fill(serverEnv.DEFAULT_USER_PASSWORD)

		const submitButton = page.getByRole('button', { name: /login/i })

		await Promise.all([
			page.waitForURL('**/', { waitUntil: 'load' }),
			submitButton.click(),
		])

		await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible()
	})
})

test.describe('Auth Sign Out', () => {
	test('signs the user out and redirects to the sign-in page', async ({ page }) => {
		await page.goto('/auth/sign-out')

		await page.waitForURL('**/auth/sign-in')

		await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
		await expect(page.getByLabel('Email')).toBeVisible()
	})
})

test.describe('Auth Sign Up', () => {
	test('allows a user to register via email and password', async ({ page }, testInfo) => {
		const uniqueId = randomUUID()
		const email = `e2e+${uniqueId}@example.com`
		const password = `Pass!${uniqueId.slice(0, 8)}`
		const name = `E2E ${uniqueId.slice(0, 4)}`

		await testInfo.attach('generated-sign-up-email', {
			body: email,
			contentType: 'text/plain',
		})

		await page.goto('/auth/sign-up')

		await page.getByLabel('Name').fill(name)
		await page.getByLabel('Email').fill(email)
		await page.getByLabel('Password', { exact: true }).fill(password)

		const confirmPasswordInput = page.getByLabel('Confirm Password', { exact: true })
		if (await confirmPasswordInput.count()) {
			await confirmPasswordInput.fill(password)
		}

		const submitButton = page.getByRole('button', { name: /create an account/i })

		await Promise.all([
			page.waitForURL('**/', { waitUntil: 'load' }),
			submitButton.click(),
		])

		await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible()
	})
})
