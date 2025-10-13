import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

import type { Metadata } from 'next'

import { Toaster } from '@packages/ui/components/sonner'
import { ThemeProvider } from '@packages/ui/components/theme-provider'

import { AuthUIProvider, QueryClientProvider } from '@/providers'

const fontSans = Geist({
	subsets: ['latin'],
	variable: '--font-sans',
})

const fontMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-mono',
})

export const metadata: Metadata = {
	title: 'Example App',
	description: 'An example app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className="h-full">
			<body className={`${fontSans.variable} ${fontMono.variable} flex min-h-full flex-col font-sans antialiased`}>
				<ThemeProvider>
					<QueryClientProvider>
						<AuthUIProvider>
							{children}
							<Toaster />
						</AuthUIProvider>
					</QueryClientProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
