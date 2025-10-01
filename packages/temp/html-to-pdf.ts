import { readFileSync } from "fs";
import { join } from "path";
import puppeteer from "puppeteer";

// Function to generate PDF from HTML using Puppeteer
export async function htmlToPdf(html: string): Promise<Blob> {
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	})

	try {
		const page = await browser.newPage()

		// Read the github-markdown-light-css file
		const githubCssPath = join(__dirname, '../node_modules/github-markdown-css/github-markdown-light.css')
		const githubCSS = readFileSync(githubCssPath, 'utf-8')

		// Read the custom PDF styles
		const pdfCssPath = join(__dirname, 'pdf-styles.css')
		const pdfCSS = readFileSync(pdfCssPath, 'utf-8')

		// Create styled HTML with GitHub Markdown Light CSS and custom PDF styles
		const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Document</title>
          <style>
            ${githubCSS}
            ${pdfCSS}
          </style>
        </head>
        <body>
          <div class="markdown-body">
            ${html}
          </div>
        </body>
      </html>
    `

		// Set the styled HTML content
		await page.setContent(styledHtml, { waitUntil: 'networkidle0' })

		// Generate PDF
		const pdf = await page.pdf({
			format: 'A4',
			margin: {
				top: '25mm',
				right: '25mm',
				bottom: '25mm',
				left: '25mm',
			},
			printBackground: true,
		})

		return new Blob([new Uint8Array(pdf)], { type: 'application/pdf' })
	} finally {
		await browser.close()
	}
}