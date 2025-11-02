import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { clientEnv, serverEnv } from '@/env'
import { expect, test as setup } from '@playwright/test'

const AUTH_STATE_DIR = join(process.cwd(), '.test', 'storage-state', '.auth')
const AUTH_STATE_FILE = join(AUTH_STATE_DIR, 'default.json')

const routes = {
	signUpEmail: new URL('/api/auth/sign-up/email', clientEnv.NEXT_PUBLIC_BASE_URL).toString(),
	signInEmail: new URL('/api/auth/sign-in/email', clientEnv.NEXT_PUBLIC_BASE_URL).toString(),
}

setup('prepare default auth storage state', async ({ request }) => {
	mkdirSync(AUTH_STATE_DIR, { recursive: true })

	const email = serverEnv.DEFAULT_USER_EMAIL
	const password = serverEnv.DEFAULT_USER_PASSWORD
	const name = serverEnv.DEFAULT_USER_NAME

	const attemptSignIn = () =>
		request.post(routes.signInEmail, {
			data: {
				email,
				password,
			},
		})

	let signInResponse = await attemptSignIn()

	if (!signInResponse.ok()) {
		const signUpResponse = await request.post(routes.signUpEmail, {
			data: {
				email,
				password,
				name,
			},
		})

		if (!signUpResponse.ok() && ![409, 422].includes(signUpResponse.status())) {
			throw new Error(
				`Failed to ensure default user exists. Received ${signUpResponse.status()} ${signUpResponse.statusText()}`
			)
		}

		signInResponse = await attemptSignIn()
	}

	expect(signInResponse.ok(), 'Default user sign-in should succeed').toBeTruthy()

	await request.storageState({ path: AUTH_STATE_FILE })
})
