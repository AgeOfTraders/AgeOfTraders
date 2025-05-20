/**
 * RootLayout - wraps the entire application and applies global layout and styles.
 *
 * - Sets base HTML structure and language.
 * - Injects global styles and font variables.
 * - Applies metadata including title, description, and robots.
 *
 * Font: Nunito Sans (Google Fonts)
 */

import type { Metadata, Viewport } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'

// Load Nunito Sans font with a custom CSS variable
const nunitoSans = Nunito_Sans({
	variable: '--font-nunito-sans',
	subsets: ['latin'],
	display: 'swap',
})

export const viewport: Viewport = {
	// 🔹 Theme colors for browser UI (used in mobile browsers and PWA)
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
	],
}

// Metadata for the entire app (can be overridden in pages)
export const metadata: Metadata = {
	// 🔹 The main title shown in the browser tab and search engines
	title: 'Age Of Traders',

	// 🔹 Basic description of the project (for SEO and sharing)
	description: 'A text-based trading strategy game set in a world of merchants, ships, and global markets.',

	// 🔹 Robots settings (temporarily set to false during development)
	// Set to true before going live
	robots: {
		// ! Change this when the MVP is ready
		index: false, // Forbidden indexing by search engines
		follow: false, // Forbidden following links
	},

	// 🔹 Basic open graph settings for social sharing (Facebook, Discord, etc.)
	openGraph: {
		title: 'Age Of Traders',
		description: 'A nostalgic browser-based strategy game about trade, cities, and ships.',
		url: 'https://ageoftraders.com', // Replace with actual domain when deployed
		siteName: 'Age Of Traders',
		images: [
			{
				url: 'https://ageoftraders.com/og-image.jpg', // Custom image for social previews
				width: 1200,
				height: 630,
				alt: 'Age Of Traders Game Banner',
			},
		],
		type: 'website',
	},

	// 🔹 Twitter card metadata
	twitter: {
		card: 'summary_large_image',
		title: 'Age Of Traders',
		description: 'A strategic text-based game set in a world of trade and discovery.',
		images: ['https://ageoftraders.com/og-image.jpg'],
	},

	// 🔹 Favicon and other icons can be referenced via <link> in layout.tsx or public/
	// It's good to add them separately in the future (manifest.json, etc.)
}
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			{/* Favicon (старий формат .ico) */}
			<link rel='icon' href='/favicon.ico' />

			{/* PNG іконки різних розмірів */}
			<link rel='icon' type='image/png' sizes='16x16' href='/icon-16x16.png' />
			<link rel='icon' type='image/png' sizes='32x32' href='/icon-32x32.png' />
			<link rel='icon' type='image/png' sizes='48x48' href='/icon-48x48.png' />
			<link rel='icon' type='image/png' sizes='64x64' href='/icon-64x64.png' />
			<link rel='icon' type='image/png' sizes='128x128' href='/icon-128x128.png' />

			{/* Apple-specific icon */}
			<link rel='apple-touch-icon' sizes='180x180' href='/icon-180x180.png' />

			{/* PWA manifest */}
			<link rel='manifest' href='/manifest.json' />

			<body className={`${nunitoSans.variable} antialiased`}>{children}</body>
		</html>
	)
}
