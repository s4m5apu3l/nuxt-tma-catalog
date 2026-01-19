export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, isLoading } = useAuth()

  // Wait for auth check to complete
  if (isLoading.value) {
    return
  }

  // Redirect to admin dashboard if already authenticated
  if (isAuthenticated.value) {
    return navigateTo('/admin')
  }
})