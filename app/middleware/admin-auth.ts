export default defineNuxtRouteMiddleware(async (to) => {
	const { isAuthenticated, checkSession } = useAuth()

	// Skip auth check for login page
	if (to.path === '/admin') {
		return
	}

	// Check if user is authenticated
	if (!isAuthenticated.value) {
		// Try to restore session from Appwrite
		const hasValidSession = await checkSession()

		if (!hasValidSession) {
			return navigateTo('/admin')
		}
	}
})
