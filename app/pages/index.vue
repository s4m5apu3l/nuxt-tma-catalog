<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('categories.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('categories.description') }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
      <span class="ml-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</span>
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="error"
      icon="i-lucide-alert-circle"
      color="red"
      variant="subtle"
      :title="$t('common.error')"
      :description="error"
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

    <!-- Empty State -->
    <div v-else-if="!isLoading && categories.length === 0" class="text-center py-12">
      <UIcon name="i-lucide-folder-open" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ $t('categories.empty.title') }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        {{ $t('categories.empty.description') }}
      </p>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoryCard
        v-for="category in categories"
        :key="category.$id"
        :category="category"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategories } from '~/composables/useCategories'

const { categories, isLoading, error, fetchCategories, clearError } = useCategories()

// Fetch categories on page load
onMounted(async () => {
  await fetchCategories()
})

// Retry function for error state
const retryFetch = async () => {
  clearError()
  await fetchCategories()
}

// SEO Meta
useSeoMeta({
  title: 'Categories - TMA Catalog',
  description: 'Browse our product categories to find what you\'re looking for.',
})
</script>
