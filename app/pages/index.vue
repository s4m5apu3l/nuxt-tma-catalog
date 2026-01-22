<template>
	<div class="py-8">
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
				{{ $t('categories.title') }}
			</h1>
			<p class="text-gray-600 dark:text-gray-400">
				{{ $t('categories.description') }}
			</p>
		</div>

		<ErrorBoundary @retry="retryFetch">
			<!-- Loading State -->
			<LoadingState v-if="isLoading" :text="$t('categories.loading')" />

			<!-- Error State -->
			<ErrorAlert v-else-if="error" :error="error" :on-retry="retryFetch" @retry="retryFetch" />

			<!-- Empty State -->
			<EmptyState
				v-else-if="!isLoading && categories.length === 0"
				icon="i-lucide-folder-open"
				:title="$t('categories.empty.title')"
				:description="$t('categories.empty.description')"
			/>

			<!-- Categories Grid -->
			<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<CategoryCard v-for="category in categories" :key="category.$id" :category="category" />
			</div>
		</ErrorBoundary>
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
	description: "Browse our product categories to find what you're looking for."
})
</script>
