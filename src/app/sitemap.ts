// ✅ Automatically generates sitemap.xml in Next.js 13+ App Router projects

import type { MetadataRoute } from 'next'

/**
 * Sitemap generator function for Next.js.
 *
 * Next.js will automatically generate a sitemap.xml file from this return value.
 * Place this file at `app/sitemap.ts` or `src/app/sitemap.ts`.
 *
 * Each object in the returned array represents a URL in your site,
 * including metadata like change frequency and priority.
 */

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			// 🔹 Home page (most important)
			url: 'https://ageoftraders.com',
			lastModified: new Date(), // automatically sets today's date
			changeFrequency: 'yearly', // home rarely changes
			priority: 1.0, // highest priority
			images: ['https://ageoftraders.com/og-image.jpg'], // optional preview image
		},
		{
			// 🔹 About page (general information)
			url: 'https://ageoftraders.com/about',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			// 🔹 Blog or news page (frequent updates)
			url: 'https://ageoftraders.com/blog',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.5,
		},
	]
}
