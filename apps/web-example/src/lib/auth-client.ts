import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import type { auth } from './auth.ts'

export const authClient = createAuthClient({
	baseURL: process.env['BASE_URL']!,
	plugins: [inferAdditionalFields<typeof auth>()],
})
