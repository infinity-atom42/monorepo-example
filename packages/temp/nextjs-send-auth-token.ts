// Get session from Better Auth (using secure HTTP-only cookies)
// The JWT token is automatically included in the response context
const sessionResult = await auth.api.getSession({
	headers: request.headers,
	asResponse: true,
})

if (!sessionResult) {
	return NextResponse.json({ error: 'Unauthorized - No session found' }, { status: 401 })
}

// Extract JWT from the set-auth-jwt header (server-side only)
const accessToken = sessionResult.headers.get('set-auth-jwt')

if (!accessToken) {
	return NextResponse.json({ error: 'Failed to obtain JWT token' }, { status: 500 })
}

const response = await fetch(url, {
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${accessToken}`,
	},
})