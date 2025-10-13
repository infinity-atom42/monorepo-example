'use client'

import type React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProps } from 'next-themes'

export type ThemeProviderProps = NextThemesProps & {
	children: React.ReactNode
}

export function ThemeProvider(props: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			enableColorScheme
			{...props}
		/>
	)
}
