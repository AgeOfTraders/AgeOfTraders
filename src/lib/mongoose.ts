/**
 * @file MongoDB Database Connection Manager
 * @module lib/mongodb
 * @description
 * Manages MongoDB connections with caching and environment-specific optimization.
 * Implements production-grade connection pooling, timeout handling, and retry logic.
 * Designed for both serverless and traditional server environments.
 *
 * Key Features:
 * - Connection caching for Next.js/Hot Reload compatibility
 * - Environment-aware configuration (dev/prod)
 * - Automatic retries for production environments
 * - Read preference for replica sets
 * - Comprehensive error handling
 * - Type-safe configuration
 *
 * @example
 * // Basic usage in API route:
 * import { connectToMongoDB } from '@/lib/mongodb'
 *
 * export default async function handler(req, res) {
 *   try {
 *     const db = await connectToMongoDB()
 *     const users = await db.connection.db.collection('users').find().toArray()
 *     res.status(200).json(users)
 *   } catch (error) {
 *     res.status(500).json({ error: 'Database connection failed' })
 *   }
 * }
 */

import { UtilsService } from '@/services/Utils/utils.service'
import mongoose, { type ConnectOptions, type Mongoose } from 'mongoose'

// Helper function to replace waitForTimeout (if needed)
const waitForTimeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Possible values for NODE_ENV
 */
type NodeEnv = 'development' | 'production' | 'test'

/**
 * MongoDB connection URI retrieved from environment variables
 * @constant {string}
 * @throws {Error} When MONGODB_URI is not defined
 */
const uri = UtilsService.getEnvVar('MONGODB_URI')

/**
 * Target database name from environment variables
 * @constant {string}
 * @throws {Error} When MONGODB_DB_NAME is not defined
 */
const dbName = UtilsService.getEnvVar('MONGODB_DB_NAME')

/**
 * Current Node.js environment mode
 * @constant {NodeEnv}
 * @default 'development'
 */
const nodeEnv = UtilsService.getEnvVar<NodeEnv>('NODE_ENV', { defaultValue: 'development' })

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
 * Establishes or returns cached MongoDB connection
 * @async
 * @function connectToMongoDB
 * @returns {Promise<Mongoose>} Connected Mongoose instance
 *
 * @throws {Error} When:
 * - Connection parameters are invalid
 * - Server selection timeout is reached
 * - Authentication fails
 *
 * @description
 * Implements a singleton-like connection pattern with:
 * 1. Connection caching to prevent duplicate connections
 * 2. Production-optimized settings including:
 *    - Connection pooling (10 dev / 20 prod)
 *    - Read preference for replica sets
 *    - Write concern majority
 *    - Automatic retry mechanisms
 * 3. Development-friendly timeouts
 *
 * Connection Parameters:
 * - Development: Faster timeouts, smaller connection pool
 * - Production: Redundant retries, larger pool, read scaling
 */
export async function connectToMongoDB(): Promise<Mongoose> {
	// Return cached connection if available
	if (cached.conn) {
		return cached.conn
	}

	// Initialize new connection if none exists
	if (!cached.promise) {
		const socketTimeoutMS = UtilsService.getEnvVar('MONGODB_SOCKET_TIMEOUT_MS', {
			type: 'number',
			defaultValue: isProduction ? 45000 : 30000,
		})
		const serverSelectionTimeoutMS = UtilsService.getEnvVar('MONGODB_SERVER_SELECTION_TIMEOUT_MS', {
			type: 'number',
			defaultValue: isProduction ? 10000 : 5000,
		})
		const connectTimeoutMS = UtilsService.getEnvVar('MONGODB_CONNECT_TIMEOUT_MS', {
			type: 'number',
			defaultValue: 30000,
		})

		const opts: MongoDBConnectionOptions = {
			dbName,
			bufferCommands: false, // Disable for serverless environments
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
 * Closes the current MongoDB connection
 * @async
 * @function disconnectFromMongoDB
 * @returns {Promise<void>}
 * @description Closes the cached MongoDB connection and resets the cache
 */
export async function disconnectFromMongoDB(): Promise<void> {
	if (cached.conn) {
		await cached.conn.disconnect()
		cached.conn = null
		cached.promise = null
		console.log('MongoDB connection disconnected')
	}
}
