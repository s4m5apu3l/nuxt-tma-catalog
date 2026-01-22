import { account, ensureAnonymousSession, validatePublicReadAccess, databases, createOrGetUserDocument, checkUserAdminStatus, handleAppwriteError } from '~/utils/appwrite'
import type { Models } from 'appwrite'
import type { TelegramUser } from './useTelegramWebApp'

interface AuthState {
	user: Models.User<Models.Preferences> | null
	telegramUser: TelegramUser | null
	isLoading: boolean
	error: string | null
	isInitialized: boolean
}

interface AppwriteUser extends Models.User<Models.Preferences> {
	telegramId?: number
	isAdmin?: boolean
}

export const useAuth = () => {
	// Reactive state
	const state = reactive<AuthState>({
		user: null,
		telegramUser: null,
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

	// Check if user is admin (updated for Telegram users)
	const isAdmin = computed(() => {
		if (!state.user && !state.telegramUser) return false
		
		// Check Telegram user admin status
		if (state.telegramUser) {
			// You can customize this logic based on your admin system
			// For now, check if user has admin privileges in your system
			return state.user?.labels?.includes('admin') || false
		}
		
		// Fallback to original logic for email users
		return state.user?.labels?.includes('admin') || state.user?.email === 'admin@example.com'
	})

	// Authenticate with Telegram WebApp data
	const authenticateWithTelegram = async (): Promise<boolean> => {
		try {
			clearError()
			setLoading(true)

			const { user: telegramUser, initData, isAvailable } = useTelegramWebApp()

			if (!isAvailable || !telegramUser.value || !initData.value) {
				setError('Telegram WebApp data not available')
				return false
			}

			// Store Telegram user data
			state.telegramUser = telegramUser.value

			// Create or update user in Appwrite
			const appwriteUser = await createOrUpdateTelegramUser(telegramUser.value, initData.value)
			
			if (appwriteUser) {
				state.user = appwriteUser
				return true
			}

			return false
		} catch (error: unknown) {
			console.error('Telegram authentication error:', error)
			const err = error as { message?: string }
			setError(err.message || 'Telegram authentication failed')
			return false
		} finally {
			setLoading(false)
		}
	}

	// Create or update Telegram user in Appwrite
	const createOrUpdateTelegramUser = async (telegramUser: TelegramUser, initData: string): Promise<Models.User<Models.Preferences> | null> => {
		try {
			// Create or get user document in Users collection
			const userDoc = await createOrGetUserDocument(telegramUser)
			if (!userDoc) {
				throw new Error('Failed to create user document')
			}

			// Create a unique user ID based on Telegram ID
			const userId = `telegram_${telegramUser.id}`
			const email = `${telegramUser.id}@telegram.local`
			const name = `${telegramUser.first_name}${telegramUser.last_name ? ' ' + telegramUser.last_name : ''}`

			try {
				// Try to create account
				await account.create(userId, email, 'telegram_auth_' + telegramUser.id, name)
			} catch (error: any) {
				// User might already exist, that's okay
				if (error.code !== 409) {
					throw error
				}
			}

			// Create session
			await account.createEmailPasswordSession(email, 'telegram_auth_' + telegramUser.id)

			// Get user data
			const user = await account.get()

			// Update user preferences with Telegram data and admin status
			await account.updatePrefs({
				telegramId: telegramUser.id,
				telegramUsername: telegramUser.username,
				telegramFirstName: telegramUser.first_name,
				telegramLastName: telegramUser.last_name,
				telegramLanguageCode: telegramUser.language_code,
				telegramIsPremium: telegramUser.is_premium,
				telegramPhotoUrl: telegramUser.photo_url,
				isAdmin: userDoc.isAdmin || false,
				lastTelegramAuth: new Date().toISOString()
			})

			return user
		} catch (error: unknown) {
			console.error('Error creating/updating Telegram user:', error)
			setError(handleAppwriteError(error))
			throw error
		}
	}

	// Check if user has admin privileges (updated to use Users collection)
	const checkAdminPrivileges = async (telegramId: number): Promise<boolean> => {
		try {
			return await checkUserAdminStatus(telegramId)
		} catch (error) {
			console.error('Error checking admin privileges:', error)
			return false
		}
	}

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
			try {
				setLoading(true)
				clearError()

				// First, try Telegram authentication if available
				const { isAvailable } = useTelegramWebApp()
				if (isAvailable) {
					console.log('Telegram WebApp available, attempting authentication...')
					const telegramAuthSuccess = await authenticateWithTelegram()
					
					if (telegramAuthSuccess) {
						console.log('Telegram authentication successful')
						return
					} else {
						console.log('Telegram authentication failed, falling back to regular auth')
					}
				}

				// Try to get current user session
				const user = await getCurrentUser()

				// If no authenticated user, ensure anonymous session for public access
				if (!user) {
					console.log('No authenticated user found, ensuring anonymous session for public access')
					await ensureAnonymousSession()

					// Validate public read access
					const accessValidation = await validatePublicReadAccess()

					if (!accessValidation.categories || !accessValidation.products) {
						console.warn('Some collections may not have proper public read access configured')
					}
				}
			} catch (error) {
				console.error('Auth initialization error:', error)
				setError('Failed to initialize authentication')
			} finally {
				setLoading(false)
				state.isInitialized = true
			}
		}
	}

	return {
		// State (readonly)
		user: readonly(toRef(state, 'user')),
		telegramUser: readonly(toRef(state, 'telegramUser')),
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
		clearError,
		authenticateWithTelegram,
		checkAdminPrivileges
	}
}
