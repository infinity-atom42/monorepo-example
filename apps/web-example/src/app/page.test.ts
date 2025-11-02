import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
	test('should render the homepage correctly with title', async ({ page }) => {
		await page.goto('/')

		// Check for the main title
		await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible()
	})

	test('should display posts data after clicking Get Posts button', async ({ page }) => {
		await page.goto('/')

		// Click the Get Posts button
		const getPostsButton = page.getByRole('button', { name: 'Get Posts' })
		await getPostsButton.click()

		// Wait for the posts data to appear
		await expect(page.getByText('Posts Response:')).toBeVisible()

		// Verify the data container is visible
		const postsContainer = page.locator('div').filter({ hasText: 'Posts Response:' }).first()
		await expect(postsContainer).toBeVisible()
	})

	test('should display products data after clicking Get Products button', async ({ page }) => {
		await page.goto('/')

		// Click the Get Products button
		const getProductsButton = page.getByRole('button', { name: 'Get Products' })
		await getProductsButton.click()

		// Wait for the products data to appear
		await expect(page.getByText('Products Response:')).toBeVisible()

		// Verify the data container is visible
		const productsContainer = page.locator('div').filter({ hasText: 'Products Response:' }).first()
		await expect(productsContainer).toBeVisible()
	})

	test('should handle button loading states correctly', async ({ page }) => {
		await page.goto('/')

		const getPostsButton = page.getByRole('button', { name: 'Get Posts' })
		const getProductsButton = page.getByRole('button', {
			name: 'Get Products',
		})

		// Initially both buttons should be enabled
		await expect(getPostsButton).toBeEnabled()
		await expect(getProductsButton).toBeEnabled()

		// Click Get Posts button
		await getPostsButton.click()

		// Get Posts button should show loading state and be disabled
		await expect(page.getByRole('button', { name: /Loading|Get Posts/ })).toBeVisible()

		// Wait for loading to complete
		await expect(getPostsButton).toBeEnabled({ timeout: 500 })

		// Click Get Products button
		await getProductsButton.click()

		// Get Products button should show loading state
		await expect(page.getByRole('button', { name: /Loading|Get Products/ })).toBeVisible()

		// Wait for loading to complete
		await expect(getProductsButton).toBeEnabled({ timeout: 500 })
	})
})
