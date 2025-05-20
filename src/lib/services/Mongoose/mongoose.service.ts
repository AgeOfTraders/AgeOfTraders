/**
 * @file Mongoose Service Module
 * @module services/Mongoose/mongoose.service
 * @description
 * Provides a service layer for managing MongoDB connections and operations using Mongoose.
 * This module abstracts the core database connection logic and serves as a foundation
 * for CRUD operations and other database-related functionalities. It is designed to be
 * extensible, allowing gradual addition of methods as the application grows.
 *
 * @example
 * // Usage in an API route
 * import { MongooseService } from '@/lib/services/Mongoose/mongoose.service';
 * export default async function handler(req, res) {
 *   try {
 *     await MongooseService.connectToDb();
 *     const db = MongooseService.getConnection().db;
 *     res.status(200).json({ message: 'Connected to MongoDB' });
 *   } catch (error) {
 *     res.status(500).json({ error: 'Database connection failed' });
 *   }
 * }
 */

import mongoose, { type Connection } from 'mongoose'
import { connectToDb, disconnectFromDb } from './connectToDb'

/**
 * Interface defining the shape of the MongooseService object.
 * Specifies the available methods and their types for type safety and extensibility.
 */
interface MongooseService {
	/**
	 * Establishes a connection to the MongoDB database.
	 * @async
	 * @returns {Promise<void>} Resolves when the connection is successfully established
	 * @throws {Error} If the connection fails
	 */
	connectToDb(): Promise<void>

	/**
	 * Closes the current MongoDB connection.
	 * @async
	 * @returns {Promise<void>} Resolves when the connection is successfully closed
	 */
	disconnect(): Promise<void>

	/**
	 * Retrieves the current Mongoose connection instance.
	 * @returns {Connection} The active Mongoose connection
	 * @throws {Error} If no connection is established
	 */
	getConnection(): Connection
}

/**
 * Service object for managing MongoDB connections and operations with Mongoose.
 *
 * @namespace MongooseService
 */
export const MongooseService: MongooseService = {
	/**
	 * Establishes a connection to the MongoDB database.
	 *
	 * @async
	 * @function connectToDb
	 * @returns {Promise<void>} Resolves when the connection is successfully established
	 * @throws {Error} If the connection fails (propagated from the underlying connectToDb function)
	 *
	 * @description
	 * This method delegates to the `connectToDb` utility function, which handles
	 * the core connection logic with retry mechanisms and caching. It serves as
	 * the primary entry point for database connectivity within the service layer.
	 *
	 * @example
	 * await MongooseService.connectToDb();
	 */
	async connectToDb() {
		await connectToDb()
	},

	/**
	 * Closes the current MongoDB connection.
	 *
	 * @async
	 * @function disconnect
	 * @returns {Promise<void>} Resolves when the connection is successfully closed
	 *
	 * @description
	 * This method delegates to the `disconnectFromDb` utility function, ensuring
	 * proper cleanup of the database connection and cache reset. It is useful for
	 * shutting down the application or testing environments.
	 *
	 * @example
	 * await MongooseService.disconnect();
	 */
	async disconnect() {
		await disconnectFromDb()
	},

	/**
	 * Retrieves the current Mongoose connection instance.
	 *
	 * @function getConnection
	 * @returns {Connection} The active Mongoose connection
	 * @throws {Error} If no connection is established
	 *
	 * @description
	 * Returns the cached Mongoose connection instance for direct database operations.
	 * This method should be used after a successful `connectToDb` call to access
	 * collections or perform queries.
	 *
	 * @example
	 * const db = MongooseService.getConnection().db;
	 * const users = await db.collection('users').find().toArray();
	 */
	getConnection(): Connection {
		if (!mongoose.connection.readyState) {
			throw new Error('No active MongoDB connection. Call connectToDb first.')
		}
		return mongoose.connection
	},
}
