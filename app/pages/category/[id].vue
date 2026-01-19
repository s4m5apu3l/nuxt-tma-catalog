<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="isLoadingCategory || isLoadingProducts" class="flex justify-center items-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
      <span class="ml-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</span>
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="categoryError || productsError"
      icon="i-lucide-alert-circle"
      color="red"
      variant="subtle"
      :title="$t('common.error')"
      :description="categoryError || productsError"
      class="mb-6"
    >
      <template #actions>
        <UButton
          color="red"
          variant="ghost"
          size="xs"
          @click="retryFetch"
        >
          {{ $t('common.retry') }}
        </UButton>
      </template>
    </UAlert>

    <!-- Category not found -->
    <div v-else-if="!category" class="text-center py-12">
      <UIcon name="i-lucide-folder-x" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ $t('category.notFound.title') }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        {{ $t('category.notFound.description') }}
      </p>
      <UButton @click="navigateTo('/')">
        {{ $t('category.backToCategories') }}
      </UButton>
    </div>

    <!-- Category Content -->
    <div v-else>
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <NuxtLink to="/" class="text-primary-600 hover:text-primary-700 dark:text-primary-400">
              {{ $t('categories.title') }}
            </NuxtLink>
          </li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-600 dark:text-gray-400">{{ category.name }}</li>
        </ol>
      </nav>

      <!-- Category Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ category.name }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('category.productsDescription', { count: products.length }) }}
        </p>
      </div>

      <!-- Empty Products State -->
      <div v-if="products.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-package-open" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t('products.empty.title') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('products.empty.description') }}
        </p>
        <UButton @click="navigateTo('/')">
          {{ $t('category.backToCategories') }}
        </UButton>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in products"
            :key="product.$id"
            :product="product"
          />
        </div>

        <!-- Load More Button (for future pagination) -->
        <div v-if="hasMoreProducts" class="text-center mt-8">
          <UButton
            variant="outline"
            size="lg"
            :loading="isLoadingMore"
            @click="loadMoreProducts"
          >
            {{ $t('products.loadMore') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const categoryId = route.params.id as string

// Composables
const { 
  categories, 
  isLoading: isLoadingCategory, 
  error: categoryError, 
  getCategoryById, 
  clearError: clearCategoryError 
} = useCategories()

const { 
  products, 
  isLoading: isLoadingProducts, 
  error: productsError, 
  fetchProductsByCategory, 
  clearError: clearProductsError 
} = useProducts()

// Local state
const category = ref(null)
const isLoadingMore = ref(false)
const hasMoreProducts = ref(false) // For future pagination implementation

// Fetch category and products
const fetchData = async () => {
  clearCategoryError()
  clearProductsError()
  
  // Fetch category details
  const categoryData = await getCategoryById(categoryId)
  category.value = categoryData
  
  // Fetch products for this category
  if (categoryData) {
    await fetchProductsByCategory(categoryId)
  }
}

// Retry function for error state
const retryFetch = async () => {
  await fetchData()
}

// Load more products (placeholder for pagination)
const loadMoreProducts = async () => {
  isLoadingMore.value = true
  // TODO: Implement pagination logic
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate loading
  isLoadingMore.value = false
}

// Fetch data on page load
onMounted(async () => {
  await fetchData()
})

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== categoryId) {
    await fetchData()
  }
})

// SEO Meta
useSeoMeta({
  title: computed(() => category.value ? `${category.value.name} - TMA Catalog` : 'Category - TMA Catalog'),
  description: computed(() => category.value ? `Browse products in ${category.value.name} category` : 'Browse products in this category'),
})
</script>