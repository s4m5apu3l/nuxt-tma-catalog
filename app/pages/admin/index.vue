<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, {{ user?.email }}
            </span>
            <UButton
              @click="handleLogout"
              :loading="isLoading"
              color="red"
              variant="ghost"
              icon="i-heroicons-arrow-right-on-rectangle"
            >
              Logout
            </UButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Dashboard Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Categories Management Card -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <UIcon name="i-heroicons-folder" class="h-8 w-8 text-blue-600" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Categories
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      Manage product categories
                    </dd>
                  </dl>
                </div>
              </div>
              <div class="mt-4">
                <UButton
                  to="/admin/categories"
                  color="blue"
                  variant="solid"
                  class="w-full"
                >
                  Manage Categories
                </UButton>
              </div>
            </div>
          </div>

          <!-- Products Management Card -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <UIcon name="i-heroicons-cube" class="h-8 w-8 text-green-600" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Products
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      Manage product catalog
                    </dd>
                  </dl>
                </div>
              </div>
              <div class="mt-4">
                <UButton
                  to="/admin/products"
                  color="green"
                  variant="solid"
                  class="w-full"
                >
                  Manage Products
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <UButton
                to="/admin/categories"
                color="blue"
                variant="outline"
                icon="i-heroicons-plus"
                class="justify-start"
              >
                Add Category
              </UButton>
              
              <UButton
                to="/admin/products"
                color="green"
                variant="outline"
                icon="i-heroicons-plus"
                class="justify-start"
              >
                Add Product
              </UButton>
              
              <UButton
                to="/"
                color="gray"
                variant="outline"
                icon="i-heroicons-eye"
                class="justify-start"
                target="_blank"
              >
                View Catalog
              </UButton>
              
              <UButton
                @click="handleLogout"
                color="red"
                variant="outline"
                icon="i-heroicons-arrow-right-on-rectangle"
                class="justify-start"
                :loading="isLoading"
              >
                Logout
              </UButton>
            </div>
          </div>
        </div>

        <!-- Statistics Section (placeholder for future enhancement) -->
        <div class="mt-8 bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Overview</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ categoriesCount }}</div>
                <div class="text-sm text-gray-500">Total Categories</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ productsCount }}</div>
                <div class="text-sm text-gray-500">Total Products</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">{{ imagesCount }}</div>
                <div class="text-sm text-gray-500">Total Images</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define page meta for authentication
definePageMeta({
  layout: false,
  middleware: 'auth'
})

// Use auth composable
const { user, logout, isLoading } = useAuth()

// Use data composables for statistics
const { categories } = useCategories()
const { products } = useProducts()

// Computed statistics
const categoriesCount = computed(() => categories.value?.length || 0)
const productsCount = computed(() => products.value?.length || 0)
const imagesCount = computed(() => {
  return products.value?.reduce((total, product) => {
    return total + (product.images?.length || 0)
  }, 0) || 0
})

// Handle logout
const handleLogout = async () => {
  await logout()
  await navigateTo('/admin/login')
}

// Set page title
useHead({
  title: 'Admin Dashboard - TMA Catalog'
})
</script>