import type { NextConfig } from 'next'

// Import env files here to validate during build
import './src/env.server'
import './src/env.client'

/**
 * For docker or bare metal deployments, we need to transpile the packages
 * that are not in the docker image and minimize the size of the image.
 * For this, uncomment the lines below.
 */

const nextConfig: NextConfig = {
	// output: 'standalone',
	transpilePackages: [
		'@packages/ui',
		// '@t3-oss/env-nextjs'
		// '@t3-oss/env-core'
	],
}

export default nextConfig
