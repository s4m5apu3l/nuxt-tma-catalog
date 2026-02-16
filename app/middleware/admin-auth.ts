export default defineNuxtRouteMiddleware((to) => {
	// Skip auth check for login page
	if (to.path === '/admin') {
		return
	}

	// Check auth status from reactive state (no backend request)
	const { isAuthenticated, sessionChecked } = useAuth()

	// If session was already checked and user is not authenticated - redirect
	if (sessionChecked.value && !isAuthenticated.value) {
		return navigateTo('/admin')
	}
})
