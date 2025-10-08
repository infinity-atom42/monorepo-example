'use client'

import { useState, type ReactNode } from 'react'

import { QueryClientProvider as QCP, QueryClient } from '@tanstack/react-query'

interface QueryProviderProps {
	children: ReactNode
}

export function QueryClientProvider({ children }: QueryProviderProps) {
	const [queryClient] = useState(() => new QueryClient())

	return <QCP client={queryClient}>{children}</QCP>
}
