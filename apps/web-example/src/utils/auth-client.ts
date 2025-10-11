import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { clientEnv } from '@/env'

import { type Auth } from './auth'

export const authClient = createAuthClient({
	baseURL: clientEnv.NEXT_PUBLIC_BASE_URL,
	plugins: [inferAdditionalFields<Auth>()],
})
