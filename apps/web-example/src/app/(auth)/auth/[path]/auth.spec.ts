import { randomUUID } from 'node:crypto'

import { expect, test, type Page } from '@playwright/test'

const createRandomCredentials = () => {
	const uniqueId = randomUUID()

	return {
		email: `e2e+${uniqueId}@example.com`,
		password: `Pass!${uniqueId.slice(0, 8)}`,
		name: `E2E ${uniqueId.slice(0, 4)}`,
	}
}

type Credentials = ReturnType<typeof createRandomCredentials>

const existingUser: Credentials = createRandomCredentials()

const signInWithCredentials = async (page: Page, { email, password }: Pick<Credentials, 'email' | 'password'>) => {
	await page.goto('/auth/sign-in')

	await page.getByLabel('Email').fill(email)
	await page.getByLabel('Password', { exact: true }).fill(password)

	const submitButton = page.getByRole('button', { name: /login/i })

	await Promise.all([page.waitForURL('**/', { waitUntil: 'load' }), submitButton.click()])
}

// Ensure this suite starts unauthenticated instead of reusing the shared storage state
test.use({ storageState: { cookies: [], origins: [] } })

test.describe.configure({ mode: 'serial' })

test.describe('Auth Sequential Flow', () => {
	test('allows a user to register via email and password', async ({ page }, testInfo) => {
		const { email, password, name } = existingUser

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

		await Promise.all([page.waitForURL('**/', { waitUntil: 'load' }), submitButton.click()])

		await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible()
	})

	test('allows an existing user to sign in with email and password', async ({ page }) => {
		await signInWithCredentials(page, existingUser)

		await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible()
	})

	test('signs the user out and redirects to the sign-in page', async ({ page }) => {
		await signInWithCredentials(page, existingUser)

		await page.goto('/auth/sign-out')

		await page.waitForURL('**/auth/sign-in')

		await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
		await expect(page.getByLabel('Email')).toBeVisible()
	})
})
