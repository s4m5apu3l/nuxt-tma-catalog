export default defineNuxtRouteMiddleware(async () => {
	const { isAuthenticated, isLoading, isInitialized, initAuth } = useAuth()

	// Initialize auth if not already done
	if (!isInitialized.value) {
		await initAuth()
	}

	// Wait for auth check to complete
	if (isLoading.value) {
		return
	}

	// Redirect to admin dashboard if already authenticated
	if (isAuthenticated.value) {
		return navigateTo('/admin')
	}
})
