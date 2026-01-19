export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Wait for auth check to complete
  if (isLoading.value) {
    return
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/admin/login')
  }
})