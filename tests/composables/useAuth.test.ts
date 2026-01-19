import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '~/composables/useAuth'

// Mock Appwrite account
const mockAccount = {
  createEmailPasswordSession: vi.fn(),
  get: vi.fn(),
  deleteSession: vi.fn()
}

// Mock the appwrite utils
vi.mock('~/utils/appwrite', () => ({
  account: mockAccount
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = { $id: '123', email: 'test@example.com' }
      mockAccount.createEmailPasswordSession.mockResolvedValue({})
      mockAccount.get.mockResolvedValue(mockUser)

      const { login, user, isAuthenticated } = useAuth()
      
      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result).toBe(true)
      expect(mockAccount.createEmailPasswordSession).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      )
      expect(user.value).toEqual(mockUser)
      expect(isAuthenticated.value).toBe(true)
    })

    it('should fail login with empty credentials', async () => {
      const { login, error } = useAuth()
      
      const result = await login({ email: '', password: '' })

      expect(result).toBe(false)
      expect(error.value).toBe('Email and password are required')
      expect(mockAccount.createEmailPasswordSession).not.toHaveBeenCalled()
    })

    it('should fail login with invalid email format', async () => {
      const { login, error } = useAuth()
      
      const result = await login({
        email: 'invalid-email',
        password: 'password123'
      })

      expect(result).toBe(false)
      expect(error.value).toBe('Please enter a valid email address')
      expect(mockAccount.createEmailPasswordSession).not.toHaveBeenCalled()
    })

    it('should handle authentication errors', async () => {
      mockAccount.createEmailPasswordSession.mockRejectedValue({
        code: 401,
        message: 'Invalid credentials'
      })

      const { login, error } = useAuth()
      
      const result = await login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })

      expect(result).toBe(false)
      expect(error.value).toBe('Invalid email or password')
    })

    it('should handle rate limiting errors', async () => {
      mockAccount.createEmailPasswordSession.mockRejectedValue({
        code: 429,
        message: 'Too many requests'
      })

      const { login, error } = useAuth()
      
      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result).toBe(false)
      expect(error.value).toBe('Too many login attempts. Please try again later.')
    })
  })

  describe('logout', () => {
    it('should successfully logout', async () => {
      mockAccount.deleteSession.mockResolvedValue({})

      const { logout, user, isAuthenticated } = useAuth()
      
      await logout()

      expect(mockAccount.deleteSession).toHaveBeenCalledWith('current')
      expect(user.value).toBe(null)
      expect(isAuthenticated.value).toBe(false)
    })

    it('should handle logout errors', async () => {
      mockAccount.deleteSession.mockRejectedValue(new Error('Network error'))

      const { logout, error } = useAuth()
      
      await logout()

      expect(error.value).toBe('Logout failed. Please try again.')
    })
  })

  describe('checkSession', () => {
    it('should set user when session is valid', async () => {
      const mockUser = { $id: '123', email: 'test@example.com' }
      mockAccount.get.mockResolvedValue(mockUser)

      const { checkSession, user, isAuthenticated } = useAuth()
      
      await checkSession()

      expect(user.value).toEqual(mockUser)
      expect(isAuthenticated.value).toBe(true)
    })

    it('should clear user when session is invalid', async () => {
      mockAccount.get.mockRejectedValue(new Error('No session'))

      const { checkSession, user, isAuthenticated } = useAuth()
      
      await checkSession()

      expect(user.value).toBe(null)
      expect(isAuthenticated.value).toBe(false)
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      const { login, error, clearError } = useAuth()
      
      // Trigger an error
      await login({ email: '', password: '' })
      expect(error.value).toBeTruthy()
      
      // Clear the error
      clearError()
      expect(error.value).toBe(null)
    })
  })
})