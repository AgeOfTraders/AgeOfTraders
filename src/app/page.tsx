import { MongooseService } from '@/lib/services/Mongoose/mongoose.service'

export default async function HomePage() {
	await MongooseService.connectToDb()

	return (
		<div className='min-h-screen flex justify-center items-center'>
			<h1 className='font-medium text-xl'>Age Of Traders</h1>
		</div>
	)
}
