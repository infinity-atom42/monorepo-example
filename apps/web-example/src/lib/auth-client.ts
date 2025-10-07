import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { clientEnv } from '@/env.client'
import type { auth } from './auth.ts'

export const authClient = createAuthClient({
	baseURL: clientEnv.NEXT_PUBLIC_BASE_URL,
	plugins: [inferAdditionalFields<typeof auth>()],
})
