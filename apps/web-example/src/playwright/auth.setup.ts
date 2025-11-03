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
			headers: {
				Origin: clientEnv.NEXT_PUBLIC_BASE_URL,
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
			headers: {
				Origin: clientEnv.NEXT_PUBLIC_BASE_URL,
			},
		})

		const signUpStatus = signUpResponse.status()
		const signUpBody = await signUpResponse.json().catch(() => null)

		if (!signUpResponse.ok() && ![409, 422].includes(signUpStatus)) {
			const errorBody = signUpBody ? JSON.stringify(signUpBody, null, 2) : await signUpResponse.text()
			console.error(
				`Failed to ensure default user exists. Received ${signUpStatus} ${signUpResponse.statusText()}\n${errorBody}`
			)
			process.exit(1)
		}

		signInResponse = await attemptSignIn()
		
		if (!signInResponse.ok()) {
			const signInBody = await signInResponse.json().catch(() => null)
			console.error('Sign-in failed after sign-up attempt')
			console.error('Sign-in status:', signInResponse.status())
			console.error('Sign-in body:', JSON.stringify(signInBody, null, 2))
		}
	}

	expect(signInResponse.ok(), 'Default user sign-in should succeed').toBeTruthy()

	await request.storageState({ path: AUTH_STATE_FILE })
})
