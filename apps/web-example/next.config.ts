import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'
import createJiti from 'jiti'

// Import env files here to validate during build. Using jiti we can import .ts files :)
const jiti = createJiti(fileURLToPath(import.meta.url))
jiti('./src/env.server')
jiti('./src/env.client')

const nextConfig: NextConfig = {
	transpilePackages: ['@packages/ui'],
}

export default nextConfig
