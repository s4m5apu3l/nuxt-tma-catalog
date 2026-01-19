import { account } from '~/utils/appwrite'
import type { Models } from 'appwrite'

interface AuthState {
	user: Models.User<Models.Preferences> | null
	isLoading: boolean
	error: string | null
	isInitialized: boolean
}

export const useAuth = () => {
	// Reactive state
	const state = reactive<AuthState>({
		user: null,
		isLoading: false,
		error: null,
		isInitialized: false
	})

	// Clear error state
	const clearError = () => {
		state.error = null
	}

	// Set loading state
	const setLoading = (loading: boolean) => {
		state.isLoading = loading
	}

	// Set error state
	const setError = (error: string) => {
		state.error = error
	}

	// Check if user is authenticated
	const isAuthenticated = computed(() => !!state.user)

	// Check if user is admin (you can customize this logic)
	const isAdmin = computed(() => {
		if (!state.user) return false
		// You can add custom logic here to check admin role
		// For now, we'll check if user has admin label or specific email
		return state.user.labels?.includes('admin') || state.user.email === 'admin@example.com'
	})

	// Get current user session
	const getCurrentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
		try {
			clearError()
			setLoading(true)

			const user = await account.get()
			state.user = user
			return user
		} catch (error: unknown) {
			console.error('Get current user error:', error)
			const err = error as { code?: number }
			if (err.code !== 401) {
				setError('Failed to get user session')
			}
			state.user = null
			return null
		} finally {
			setLoading(false)
			state.isInitialized = true
		}
	}

	// Login with email and password
	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			clearError()
			setLoading(true)

			// Validate input
			if (!email || !password) {
				setError('Email and password are required')
				return false
			}

			// Create session
			await account.createEmailPasswordSession(email, password)

			// Get user data
			const user = await account.get()
			state.user = user

			return true
		} catch (error: unknown) {
			console.error('Login error:', error)
			const err = error as { code?: number; message?: string }

			if (err.code === 401) {
				setError('Invalid email or password')
			} else if (err.code === 429) {
				setError('Too many login attempts. Please try again later.')
			} else {
				setError(err.message || 'Login failed. Please try again.')
			}

			return false
		} finally {
			setLoading(false)
		}
	}

	// Logout
	const logout = async (): Promise<boolean> => {
		try {
			clearError()
			setLoading(true)

			await account.deleteSession('current')
			state.user = null

			// Redirect to home page
			await navigateTo('/')

			return true
		} catch (error: unknown) {
			console.error('Logout error:', error)
			setError('Logout failed. Please try again.')
			return false
		} finally {
			setLoading(false)
		}
	}

	// Register new user (if needed)
	const register = async (email: string, password: string, name: string): Promise<boolean> => {
		try {
			clearError()
			setLoading(true)

			// Validate input
			if (!email || !password || !name) {
				setError('All fields are required')
				return false
			}

			if (password.length < 8) {
				setError('Password must be at least 8 characters long')
				return false
			}

			// Create account
			await account.create('unique()', email, password, name)

			// Login after registration
			const loginSuccess = await login(email, password)
			return loginSuccess
		} catch (error: unknown) {
			console.error('Registration error:', error)
			const err = error as { code?: number; message?: string }

			if (err.code === 409) {
				setError('An account with this email already exists')
			} else if (err.code === 400) {
				setError('Invalid email or password format')
			} else {
				setError(err.message || 'Registration failed. Please try again.')
			}

			return false
		} finally {
			setLoading(false)
		}
	}

	// Initialize auth state (call this on app startup)
	const initAuth = async () => {
		if (!state.isInitialized) {
			await getCurrentUser()
		}
	}

	return {
		// State (readonly)
		user: readonly(toRef(state, 'user')),
		isLoading: readonly(toRef(state, 'isLoading')),
		error: readonly(toRef(state, 'error')),
		isInitialized: readonly(toRef(state, 'isInitialized')),

		// Computed
		isAuthenticated,
		isAdmin,

		// Actions
		getCurrentUser,
		login,
		logout,
		register,
		initAuth,
		clearError
	}
}