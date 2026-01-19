import { account } from '~/utils/appwrite'
import type { Models } from 'appwrite'

interface LoginCredentials {
  email: string
  password: string
}

interface AuthState {
  user: Models.User<Models.Preferences> | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  // Reactive state
  const authState = reactive<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })

  // Clear error state
  const clearError = () => {
    authState.error = null
  }

  // Set loading state
  const setLoading = (loading: boolean) => {
    authState.isLoading = loading
  }

  // Set error state
  const setError = (error: string) => {
    authState.error = error
  }

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      clearError()
      setLoading(true)

      // Validate credentials
      if (!credentials.email || !credentials.password) {
        setError('Email and password are required')
        return false
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(credentials.email)) {
        setError('Please enter a valid email address')
        return false
      }

      // Create session
      await account.createEmailPasswordSession(credentials.email, credentials.password)
      
      // Get user data
      const user = await account.get()
      authState.user = user
      authState.isAuthenticated = true

      return true
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle specific Appwrite errors
      if (error.code === 401) {
        setError('Invalid email or password')
      } else if (error.code === 429) {
        setError('Too many login attempts. Please try again later.')
      } else {
        setError('Login failed. Please try again.')
      }
      
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      clearError()

      await account.deleteSession('current')
      
      // Clear auth state
      authState.user = null
      authState.isAuthenticated = false
    } catch (error: any) {
      console.error('Logout error:', error)
      setError('Logout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Check current session
  const checkSession = async (): Promise<void> => {
    try {
      setLoading(true)
      clearError()

      const user = await account.get()
      authState.user = user
      authState.isAuthenticated = true
    } catch (error: any) {
      // User is not authenticated
      authState.user = null
      authState.isAuthenticated = false
    } finally {
      setLoading(false)
    }
  }

  // Initialize auth state on composable creation
  onMounted(() => {
    checkSession()
  })

  return {
    // State (readonly)
    user: readonly(toRef(authState, 'user')),
    isAuthenticated: readonly(toRef(authState, 'isAuthenticated')),
    isLoading: readonly(toRef(authState, 'isLoading')),
    error: readonly(toRef(authState, 'error')),
    
    // Actions
    login,
    logout,
    checkSession,
    clearError
  }
}