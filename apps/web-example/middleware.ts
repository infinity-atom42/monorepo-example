import type { NextMiddlewareResult } from 'next/dist/server/web/types'
import { NextResponse } from 'next/server'

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public directory
		 * - api/auth routes (signin, callback, signout)
		 */
		'/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
	],
}

export default async function middleware(): Promise<NextMiddlewareResult> {
	return NextResponse.next()
}
