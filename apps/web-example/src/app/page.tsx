'use client'

import { useState } from 'react'

import { Button } from '@packages/ui/components/button'

import { example } from '@/utils/api'

export default function Page() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [postsData, setPostsData] = useState<any>(null)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [productsData, setProductsData] = useState<any>(null)
	const [loading, setLoading] = useState<string | null>(null)

	const handleGetPosts = async () => {
		try {
			setLoading('posts')

			const response = await example.v1.posts.get({ query: { page: 1, limit: 10 } })

			setPostsData(response.data)
			console.log('Posts:', response.data)
		} catch (error) {
			console.error('Error fetching posts:', error)
		} finally {
			setLoading(null)
		}
	}

	const handleGetProducts = async () => {
		try {
			setLoading('products')
			const response = await example.v1.products.get({ query: { page: 1, limit: 10 } })
			setProductsData(response.data)
			console.log('Products:', response.data)
		} catch (error) {
			console.error('Error fetching products:', error)
		} finally {
			setLoading(null)
		}
	}

	return (
		<div className="flex items-center justify-center min-h-svh">
			<div className="flex flex-col items-center justify-center gap-6 max-w-4xl w-full p-4">
				<h1 className="text-2xl font-bold">Hello World</h1>

				<div className="flex gap-4">
					<Button
						size="sm"
						onClick={handleGetPosts}
						disabled={loading === 'posts'}>
						{loading === 'posts' ? 'Loading...' : 'Get Posts'}
					</Button>
					<Button
						size="sm"
						onClick={handleGetProducts}
						disabled={loading === 'products'}>
						{loading === 'products' ? 'Loading...' : 'Get Products'}
					</Button>
				</div>

				<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
					{postsData && (
						<div className="border rounded-lg p-4">
							<h2 className="text-lg font-semibold mb-2">Posts Response:</h2>
							<pre className="text-xs overflow-auto max-h-96 bg-slate-100 dark:bg-slate-900 p-3 rounded">
								{JSON.stringify(postsData, null, 2)}
							</pre>
						</div>
					)}

					{productsData && (
						<div className="border rounded-lg p-4">
							<h2 className="text-lg font-semibold mb-2">Products Response:</h2>
							<pre className="text-xs overflow-auto max-h-96 bg-slate-100 dark:bg-slate-900 p-3 rounded">
								{JSON.stringify(productsData, null, 2)}
							</pre>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
