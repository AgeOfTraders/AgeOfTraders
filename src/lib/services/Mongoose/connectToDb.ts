/**
 * @file Mongoose Connection Utility
 * @module services/Mongoose/connect
 * @description
 * Provides utility functions for establishing and managing MongoDB connections
 * using Mongoose. This module serves as a foundational layer for the MongooseService,
 * handling connection logic, retries, and error management with environment-specific
 * optimizations.
 *
 * @example
 * // Usage within MongooseService
 * import { connectToDb, disconnectFromDb } from '@/lib/services/Mongoose/connect';
 * await connectToDb();
 */

import { getEnvVar } from '@/services/Utils/getEnvVar'
import mongoose, { type ConnectOptions, type Mongoose } from 'mongoose'

// Helper function to replace waitForTimeout
const waitForTimeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * MongoDB connection URI retrieved from environment variables
 * @constant {string}
 * @throws {Error} When MONGODB_URI is not defined
 */
const uri = getEnvVar('MONGODB_URI')

/**
 * Target database name from environment variables
 * @constant {string}
 * @throws {Error} When MONGODB_DB_NAME is not defined
 */
const dbName = getEnvVar('MONGODB_DB_NAME')

/**
 * Possible values for NODE_ENV
 */
type NodeEnv = 'development' | 'production' | 'test'

/**
 * Current Node.js environment mode
 * @constant {NodeEnv}
 * @default 'development'
 */
const nodeEnv = getEnvVar<NodeEnv>('NODE_ENV', { defaultValue: 'development' })

/**
 * Environment flag indicating production mode
 * @constant {boolean}
 */
const isProduction = nodeEnv === 'production'

/**
 * Custom connection options interface
 */
interface MongoDBConnectionOptions extends ConnectOptions {
	family?: number
}

/**
 * Global Mongoose connection cache type definition
 * @global
 * @typedef {Object} MongooseCache
 * @property {Mongoose|null} conn - Active Mongoose connection
 * @property {Promise<Mongoose>|null} promise - Pending connection promise
 */
declare global {
	// eslint-disable-next-line no-var
	var mongoose: {
		conn: Mongoose | null
		promise: Promise<Mongoose> | null
	}
}

// Initialize global cache if not exists
let cached = global.mongoose
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null }
}

/**
 * Establishes a connection to the MongoDB database with retry logic.
 * @async
 * @function connectToDb
 * @returns {Promise<Mongoose>} Connected Mongoose instance
 * @throws {Error} If all retry attempts fail
 *
 * @description
 * Initializes a MongoDB connection with environment-specific settings, including
 * connection pooling, retries, and keep-alive. Uses a singleton pattern to cache
 * the connection, optimized for Next.js environments.
 */
export async function connectToDb(): Promise<Mongoose> {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		const socketTimeoutMS = getEnvVar('MONGODB_SOCKET_TIMEOUT_MS', {
			type: 'number',
			defaultValue: isProduction ? 45000 : 30000,
		})
		const serverSelectionTimeoutMS = getEnvVar('MONGODB_SERVER_SELECTION_TIMEOUT_MS', {
			type: 'number',
			defaultValue: isProduction ? 10000 : 5000,
		})
		const connectTimeoutMS = getEnvVar('MONGODB_CONNECT_TIMEOUT_MS', { type: 'number', defaultValue: 30000 })

		const opts: MongoDBConnectionOptions = {
			dbName,
			bufferCommands: false,
			maxPoolSize: isProduction ? 20 : 10,
			socketTimeoutMS,
			serverSelectionTimeoutMS,
			connectTimeoutMS,
			family: 4, // Force IPv4 to avoid DNS issues

			// Production-specific optimizations
			...(isProduction && {
				retryWrites: true,
				retryReads: true,
				w: 'majority',
				readPreference: 'secondaryPreferred',
				ssl: true,
				authSource: 'admin',
				tlsAllowInvalidCertificates: false,
			}),
		}

		const maxRetries = isProduction ? 3 : 1
		let attempt = 0

		cached.promise = new Promise<Mongoose>((resolve, reject) => {
			const connectWithRetry = async () => {
				try {
					const mongooseInstance = await mongoose.connect(uri, opts)
					mongoose.connection.on('disconnected', () => {
						console.log('MongoDB connection disconnected')
						cached.conn = null
						cached.promise = null
					})
					resolve(mongooseInstance)
				} catch (error) {
					attempt++
					if (attempt >= maxRetries) {
						reject(error)
					} else {
						console.warn(`Retry attempt ${attempt} for MongoDB connection`)
						await waitForTimeout(2000)
						connectWithRetry()
					}
				}
			}
			connectWithRetry()
		}).then(mongooseInstance => {
			console.log('MongoDB connection established')
			return mongooseInstance
		})
	}

	try {
		cached.conn = await cached.promise
		return cached.conn
	} catch (error) {
		cached.promise = null
		console.error('MongoDB connection failed:', error)
		throw error
	}
}

/**
 * Closes the current MongoDB connection.
 * @async
 * @function disconnectFromDb
 * @returns {Promise<void>}
 * @description Closes the cached MongoDB connection and resets the cache
 */
export async function disconnectFromDb(): Promise<void> {
	if (cached.conn) {
		await cached.conn.disconnect()
		cached.conn = null
		cached.promise = null
		console.log('MongoDB connection disconnected')
	}
}
