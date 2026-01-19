export default defineNuxtRouteMiddleware(async (to) => {
	const { isAuthenticated, isLoading, isInitialized, initAuth } = useAuth()

	// Initialize auth if not already done
	if (!isInitialized.value) {
		await initAuth()
	}

	// Wait for auth to initialize if still loading
	if (isLoading.value) {
		return
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated.value) {
		return navigateTo('/admin/login?redirect=' + encodeURIComponent(to.fullPath))
	}
})
