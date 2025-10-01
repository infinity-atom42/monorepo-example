import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

// Create remark processor for sanitization and styling
const processor = remark()
	.use(remarkGfm) // GitHub Flavored Markdown (adds tables, ...)
	.use(remarkRehype) // Convert markdown to HTML
	.use(rehypePrettyCode, {
		theme: 'github-light',
		keepBackground: false,
		defaultLang: 'plaintext',
		onVisitLine(node) {
			// Prevent lines with no content from collapsing
			if (node.children.length === 0) {
				node.children = [{ type: 'text', value: ' ' }]
			}
		},
		onVisitHighlightedLine(node) {
			// Add a class to highlighting lines
			node.properties.className = node.properties.className || []
			node.properties.className.push('highlighted')
		},
		onVisitHighlightedChars(node) {
			// Add classes to highlighted characters
			node.properties.className = ['word']
		},
	}) // Beautiful code blocks with syntax highlighting
	.use(rehypeSanitize, {
		attributes: {
			'*': ['style', 'data-*'],
			figure: ['data-rehype-pretty-code-figure'],
			pre: ['tabindex', 'data-language', 'data-theme'],
			code: ['data-language', 'data-theme'],
			span: ['data-line', 'style'],
		},
	}) // Sanitize HTML content while preserving syntax highlighting
	.use(rehypeStringify) // Convert back to HTML string

// Function to sanitize markdown
export async function mdToHtml(markdown: string): Promise<string> {
	try {
		const result = await processor.process(markdown)
		return String(result)
	} catch (error) {
		console.error('Error sanitizing markdown:', error)
		throw new Error('Invalid markdown content')
	}
}
