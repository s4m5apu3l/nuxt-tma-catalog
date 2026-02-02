import type { AdminUser, LoginCredentials, AdminSession } from '~/types'

const user = ref<AdminUser | null>(null)
const session = ref<AdminSession | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useAuth = () => {
	const { account } = useAppwrite()

	const isAuthenticated = computed(() => !!session.value)

	const login = async (credentials: LoginCredentials): Promise<boolean> => {
		loading.value = true
		error.value = null

		try {
			const sessionResponse = await account.createEmailPasswordSession(credentials.email, credentials.password)

			session.value = sessionResponse as unknown as AdminSession

			// Get user details
			const userResponse = await account.get()
			user.value = userResponse as unknown as AdminUser

			return true
		} catch (err: any) {
			console.error('Login error:', err)
			error.value = err.message || 'Login failed'
			return false
		} finally {
			loading.value = false
		}
	}

	const logout = async (): Promise<void> => {
		loading.value = true
		error.value = null

		try {
			await account.deleteSession('current')
		} catch (err) {
			console.error('Logout error:', err)
		} finally {
			user.value = null
			session.value = null
			loading.value = false

			// Redirect to admin login
			await navigateTo('/admin')
		}
	}

	const checkSession = async (): Promise<boolean> => {
		loading.value = true
		error.value = null

		try {
			const userResponse = await account.get()
			user.value = userResponse as unknown as AdminUser

			const sessionResponse = await account.getSession('current')
			session.value = sessionResponse as unknown as AdminSession

			return true
		} catch (err) {
			console.error('Session check error:', err)
			user.value = null
			session.value = null
			return false
		} finally {
			loading.value = false
		}
	}

	const register = async (email: string, password: string, name: string): Promise<boolean> => {
		loading.value = true
		error.value = null

		try {
			await account.create('unique()', email, password, name)

			// Auto-login after registration
			return await login({ email, password })
		} catch (err: any) {
			console.error('Registration error:', err)
			error.value = err.message || 'Registration failed'
			return false
		} finally {
			loading.value = false
		}
	}

	const updatePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
		loading.value = true
		error.value = null

		try {
			await account.updatePassword(newPassword, oldPassword)
			return true
		} catch (err: any) {
			console.error('Password update error:', err)
			error.value = err.message || 'Password update failed'
			return false
		} finally {
			loading.value = false
		}
	}

	return {
		user: readonly(user),
		session: readonly(session),
		loading: readonly(loading),
		error: readonly(error),
		isAuthenticated,
		login,
		logout,
		checkSession,
		register,
		updatePassword
	}
}
