/**
 * @file Environment Variables Manager
 * @module utils/getEnvVar
 * @description
 * Advanced environment variable access with type conversion, validation,
 * and comprehensive error handling. Supports strings, numbers, booleans,
 * and JSON parsing with optional defaults and strict validation.
 *
 * Features:
 * - Type-safe environment variable retrieval
 * - Automatic type conversion (string, number, boolean, JSON)
 * - Custom validation rules
 * - Detailed error reporting
 * - Optional default values
 * - Production-ready error handling
 */

/**
 * Type representing all possible JSON-compatible values
 */
export type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[]

/**
 * Configuration options for environment variable retrieval
 */
export interface GetEnvVarOptions<T extends JSONValue = string> {
	/**
	 * Whether the variable is required (default: true)
	 */
	isRequired?: boolean

	/**
	 * Default value if variable not set
	 */
	defaultValue?: T

	/**
	 * Expected value type (default: 'string')
	 */
	type?: 'string' | 'number' | 'boolean' | 'json'

	/**
	 * Custom validation function
	 * @param value The parsed value
	 * @returns true if valid, false or error message if invalid
	 */
	validate?: (value: T) => boolean | string
}

/**
 * Custom error class for environment variable related errors
 */
class EnvVarError extends Error {
	constructor(name: string, message: string) {
		super(`Environment variable error [${name}]: ${message}`)
		this.name = 'EnvVarError'
		Error.captureStackTrace?.(this, EnvVarError)
	}
}

/**
 * Parses string to number with validation
 * @param value String to parse
 * @throws {EnvVarError} If the value cannot be converted to a valid number
 */
function parseNumber(value: string): number {
	const parsed = Number(value)
	if (isNaN(parsed)) {
		throw new EnvVarError('', `Invalid number value: ${value}`)
	}
	return parsed
}

/**
 * Parses string to boolean with validation
 * @param value String to parse
 * @throws {EnvVarError} If the value cannot be converted to a valid boolean
 */
function parseBoolean(value: string): boolean {
	const normalized = value.toLowerCase().trim()
	if (['true', '1', 'yes', 'y'].includes(normalized)) return true
	if (['false', '0', 'no', 'n'].includes(normalized)) return false
	throw new EnvVarError('', `Invalid boolean value: ${value}`)
}

/**
 * Parses JSON string with validation
 * @param value String to parse
 * @returns Parsed JSON value
 * @throws {EnvVarError} If the value is not a valid JSON string
 */
function parseJSON<T extends JSONValue>(value: string): T {
	try {
		return JSON.parse(value) as T
	} catch (e) {
		throw new EnvVarError('', `Invalid JSON: ${(e as Error).message}`)
	}
}

/**
 * Helper function to map type option to JavaScript type for validation
 * @param type Expected type of the environment variable
 * @returns Corresponding JavaScript type as a string
 */
function typeToString(type: 'string' | 'number' | 'boolean' | 'json'): string {
	return type === 'json' ? 'object' : type
}

/**
 * Retrieves and transforms environment variable
 * @template T - Expected return type (defaults to string)
 * @param name - Environment variable name
 * @param options - Configuration options
 * @returns Parsed environment variable value
 * @throws {EnvVarError} When validation fails, required variable is missing, or accessed on client side
 *
 * @example
 * // Basic usage
 * const PORT = getEnvVar('PORT', { type: 'number' })
 *
 * @example
 * // With default value
 * const TIMEOUT = getEnvVar('TIMEOUT', {
 *   type: 'number',
 *   defaultValue: 5000
 * })
 *
 * @example
 * // With validation
 * const RETRIES = getEnvVar('RETRIES', {
 *   type: 'number',
 *   validate: (value) => value > 0 || 'Must be positive'
 * })
 */
export function getEnvVar<T extends JSONValue = string>(
	name: string,
	options: GetEnvVarOptions<T> = { isRequired: true },
): T {
	// Ensure this function is only called on the server side (Next.js compatibility)
	if (typeof window !== 'undefined') {
		throw new EnvVarError(name, 'Environment variables can only be accessed on the server side')
	}

	const rawValue = process.env[name]
	const { isRequired = true, defaultValue, type = 'string', validate } = options

	// Handle missing value scenarios
	if (!rawValue) {
		if (defaultValue !== undefined) {
			// Validate default value type matches expected type
			if (typeof defaultValue !== typeToString(type)) {
				throw new EnvVarError(
					name,
					`Default value type (${typeof defaultValue}) does not match expected type (${type})`,
				)
			}
			return defaultValue
		}
		if (!isRequired) return '' as T // Safe cast for non-required strings
		throw new EnvVarError(name, 'Variable is required but not set')
	}

	try {
		let value: JSONValue = rawValue

		// Perform type conversion based on specified type
		switch (type) {
			case 'number':
				value = parseNumber(rawValue)
				break
			case 'boolean':
				value = parseBoolean(rawValue)
				break
			case 'json':
				value = parseJSON<T>(rawValue)
				break
			// 'string' needs no conversion
		}

		// Apply custom validation if provided
		if (validate) {
			const validationResult = validate(value as T)
			if (validationResult !== true) {
				throw new EnvVarError(
					name,
					typeof validationResult === 'string' ? validationResult : `Validation failed for value: ${value}`,
				)
			}
		}

		return value as T
	} catch (error) {
		if (error instanceof EnvVarError) {
			// Ensure variable name is included in error message
			if (!error.message.includes(name)) {
				error.message = error.message.replace('[]', `[${name}]`)
			}
			throw error
		}
		throw new EnvVarError(name, `Processing failed: ${(error as Error).message}`)
	}
}

/**
 * Utility functions for specific types with better type inference
 */
export const env = {
	/**
	 * Get string environment variable
	 * @param name Environment variable name
	 * @param options Configuration options (excluding type)
	 * @returns Parsed string value
	 */
	string: (name: string, options?: Omit<GetEnvVarOptions<string>, 'type'>) =>
		getEnvVar<string>(name, { ...options, type: 'string' }),

	/**
	 * Get number environment variable
	 * @param name Environment variable name
	 * @param options Configuration options (excluding type)
	 * @returns Parsed number value
	 */
	number: (name: string, options?: Omit<GetEnvVarOptions<number>, 'type'>) =>
		getEnvVar<number>(name, { ...options, type: 'number' }),

	/**
	 * Get boolean environment variable
	 * @param name Environment variable name
	 * @param options Configuration options (excluding type)
	 * @returns Parsed boolean value
	 */
	boolean: (name: string, options?: Omit<GetEnvVarOptions<boolean>, 'type'>) =>
		getEnvVar<boolean>(name, { ...options, type: 'boolean' }),

	/**
	 * Get JSON environment variable
	 * @template T - Expected JSON type (defaults to JSON object)
	 * @param name Environment variable name
	 * @param options Configuration options (excluding type)
	 * @returns Parsed JSON value
	 */
	json: <T extends JSONValue = Record<string, JSONValue>>(name: string, options?: Omit<GetEnvVarOptions<T>, 'type'>) =>
		getEnvVar<T>(name, { ...options, type: 'json' }),
}
