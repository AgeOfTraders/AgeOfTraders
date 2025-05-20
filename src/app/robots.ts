// app/robots.ts
// ✅ Automatically generates robots.txt at https://ageoftraders.com/robots.txt
// ✅ Works with Next.js App Router (metadata API)

import type { MetadataRoute } from 'next'

/**
 * robots() function generates the robots.txt file.
 *
 * This is used by search engine crawlers to determine which pages to index or avoid.
 * Next.js will serve this at /robots.txt automatically.
 */

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			// Applies to all user agents (search engine bots)
			userAgent: '*',

			// ✅ Allow indexing of all public pages
			allow: '/',

			// ❌ Disallow crawling of specific paths (example: admin, user profiles, etc.)
			disallow: '/private/',
		},

		// 🗺️ Link to your generated sitemap
		sitemap: 'https://ageoftraders.com/sitemap.xml',
	}
}
