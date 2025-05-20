/**
 * HomePage - Landing page of the Age Of Traders project.
 *
 * This is the public root page of the application. It displays basic information
 * about the project and provides a GitHub link for contributors.
 *
 * The database connection is initialized on page load (server-side).
 */

import { MongooseService } from '@/lib/services/Mongoose/mongoose.service'

/**
 * Renders the home/landing page of the game.
 * Connects to MongoDB via MongooseService.
 */
export default async function HomePage() {
	// Connect to the MongoDB database on initial load (server-side)
	await MongooseService.connectToDb()

	return (
		<div className='min-h-screen flex flex-col justify-center items-center px-4 text-center'>
			<h1 className='font-semibold text-2xl mb-4'>Age Of Traders</h1>

			<ul className='space-y-2 text-base max-w-xl'>
				<li>🌍 Open-source meets nostalgia.</li>
				<li>⚙️ Build features, improve gameplay, and bring classic trading back to life.</li>
				<li>
					⭐️ Star and contribute here: 👉{' '}
					<a
						href='https://github.com/AgeOfTraders/AgeOfTraders'
						className='text-blue-500 underline hover:text-blue-700'
						target='_blank'
						rel='noopener noreferrer'
					>
						GitHub
					</a>
				</li>
			</ul>
		</div>
	)
}
