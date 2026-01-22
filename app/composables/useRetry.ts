interface RetryOptions {
	maxAttempts?: number
	delay?: number
	backoff?: 'linear' | 'exponential'
	onRetry?: (attempt: number, error: Error) => void
}

interface RetryState {
	isRetrying: boolean
	attempt: number
	lastError: Error | null
}

export const useRetry = () => {
	const state = reactive<RetryState>({
		isRetrying: false,
		attempt: 0,
		lastError: null
	})

	/**
	 * Execute a function with retry logic
	 */
	const withRetry = async <T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> => {
		const { maxAttempts = 3, delay = 1000, backoff = 'exponential', onRetry } = options

		state.isRetrying = true
		state.attempt = 0
		state.lastError = null

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			state.attempt = attempt

			try {
				const result = await fn()
				state.isRetrying = false
				return result
			} catch (error) {
				const err = error instanceof Error ? error : new Error(String(error))
				state.lastError = err

				// If this is the last attempt, throw the error
				if (attempt === maxAttempts) {
					state.isRetrying = false
					throw err
				}

				// Call retry callback if provided
				if (onRetry) {
					onRetry(attempt, err)
				}

				// Calculate delay based on backoff strategy
				let retryDelay = delay
				if (backoff === 'exponential') {
					retryDelay = delay * Math.pow(2, attempt - 1)
				} else if (backoff === 'linear') {
					retryDelay = delay * attempt
				}

				// Wait before retrying
				await new Promise((resolve) => setTimeout(resolve, retryDelay))
			}
		}

		state.isRetrying = false
		throw state.lastError
	}

	/**
	 * Create a retry wrapper for a specific function
	 */
	const createRetryWrapper = <T extends (...args: any[]) => Promise<any>>(fn: T, options: RetryOptions = {}) => {
		return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
			return withRetry(() => fn(...args), options)
		}
	}

	/**
	 * Reset retry state
	 */
	const reset = () => {
		state.isRetrying = false
		state.attempt = 0
		state.lastError = null
	}

	return {
		// State (readonly)
		isRetrying: readonly(toRef(state, 'isRetrying')),
		attempt: readonly(toRef(state, 'attempt')),
		lastError: readonly(toRef(state, 'lastError')),

		// Methods
		withRetry,
		createRetryWrapper,
		reset
	}
}

/**
 * Network-specific retry composable with intelligent retry logic
 */
export const useNetworkRetry = () => {
	const { withRetry, ...retryState } = useRetry()

	/**
	 * Determine if an error is retryable
	 */
	const isRetryableError = (error: any): boolean => {
		// Network errors
		if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
			return true
		}

		// HTTP status codes that are retryable
		const retryableStatusCodes = [408, 429, 500, 502, 503, 504]
		if (error.code && retryableStatusCodes.includes(error.code)) {
			return true
		}

		// Appwrite specific errors that are retryable
		const retryableAppwriteCodes = [500, 502, 503, 504]
		if (error.code && retryableAppwriteCodes.includes(error.code)) {
			return true
		}

		// Timeout errors
		if (error.message && error.message.toLowerCase().includes('timeout')) {
			return true
		}

		return false
	}

	/**
	 * Execute network request with intelligent retry
	 */
	const withNetworkRetry = async <T>(
		fn: () => Promise<T>,
		options: Omit<RetryOptions, 'onRetry'> & {
			onRetry?: (attempt: number, error: Error, willRetry: boolean) => void
		} = {}
	): Promise<T> => {
		const { onRetry, ...retryOptions } = options

		return withRetry(fn, {
			maxAttempts: 3,
			delay: 1000,
			backoff: 'exponential',
			...retryOptions,
			onRetry: (attempt, error) => {
				const willRetry = attempt < (retryOptions.maxAttempts || 3) && isRetryableError(error)

				console.warn(`Network request failed (attempt ${attempt}):`, error.message)

				if (willRetry) {
					console.info(`Retrying in ${retryOptions.delay || 1000}ms...`)
				}

				if (onRetry) {
					onRetry(attempt, error, willRetry)
				}

				// If error is not retryable, throw immediately
				if (!willRetry && attempt < (retryOptions.maxAttempts || 3)) {
					throw error
				}
			}
		})
	}

	return {
		...retryState,
		withNetworkRetry,
		isRetryableError
	}
}
