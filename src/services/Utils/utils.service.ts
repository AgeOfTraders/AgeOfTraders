/**
 * @file Utility Service Module
 * @module services/UtilsService
 * @description
 * This module provides a utility service that exposes environment variable management
 * functionality. It serves as a centralized access point for environment-related
 * utilities within the application, leveraging the `getEnvVar` function from the
 * `getEnvVar` module.
 *
 * The service is designed to be lightweight and extensible, allowing additional
 * utility functions to be added as needed.
 */

/**
 * Imports the `getEnvVar` function from the environment variable manager module.
 * This function provides type-safe access to environment variables with support
 * for type conversion, validation, and error handling.
 *
 * @see {@link ../Utils/getEnvVar} for detailed implementation and options.
 */
import { getEnvVar, GetEnvVarOptions, JSONValue } from '@/services/Utils/getEnvVar'

/**
 * Interface defining the shape of the UtilsService object.
 * Specifies the available methods and their types for type safety.
 */
interface UtilsService {
	/**
	 * Retrieves and transforms an environment variable based on the provided options.
	 *
	 * @template T - The expected return type of the environment variable (defaults to string)
	 * @param {string} name - The name of the environment variable to retrieve
	 * @param {GetEnvVarOptions<T>} [options] - Configuration options for retrieval
	 * @returns {T} The parsed environment variable value
	 * @throws {EnvVarError} If the variable is missing, invalid, or accessed on the client side
	 */
	getEnvVar<T extends JSONValue = string>(name: string, options?: GetEnvVarOptions<T>): T
}

/**
 * Utility service object providing access to environment variable management
 * and other helper functions.
 *
 * @namespace UtilsService
 */
export const UtilsService: UtilsService = {
	/**
	 * Retrieves and transforms an environment variable based on the provided options.
	 *
	 * @template T - The expected return type of the environment variable (defaults to string)
	 * @param {string} name - The name of the environment variable to retrieve
	 * @param {import('@/services/Utils/getEnvVar').GetEnvVarOptions<T>} [options] - Configuration options for retrieval
	 * @returns {T} The parsed environment variable value
	 * @throws {import('@/services/Utils/getEnvVar').EnvVarError} If the variable is missing, invalid, or accessed on the client side
	 *
	 * @example
	 * // Get a number environment variable with a default value
	 * const port = UtilsService.getEnvVar('PORT', { type: 'number', defaultValue: 3000 });
	 *
	 * @example
	 * // Get a string with validation
	 * const apiKey = UtilsService.getEnvVar('API_KEY', {
	 *   validate: (value) => value.length > 10 || 'API key must be longer than 10 characters'
	 * });
	 */
	getEnvVar,
}
