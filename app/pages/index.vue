<script setup lang="ts">
import type { Category } from '~/types'
import { getCategoryName } from '~/utils/localization'

const { categories, loading: categoriesLoading, fetchCategories } = useCategories()
const { products, isLoading: productsLoading, fetchProducts } = useProducts()

const selectedCategory = ref<Category | null>(null)

const handleCategorySelect = async (category: Category) => {
	selectedCategory.value = category
	await fetchProducts(category.$id)
}

const showAllProducts = async () => {
	selectedCategory.value = null
	await fetchProducts()
}

onMounted(async () => {
	await fetchCategories()
	await fetchProducts() // Загружаем все продукты по умолчанию
})

const skeletonItems = Array.from({ length: 6 }, (_, i) => i)

const { locale } = useI18n()
</script>

<template>
	<div class="space-y-6">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{{ $t('categories.title') }}
				</h2>
				<UButton v-if="selectedCategory" variant="ghost" size="sm" @click="showAllProducts">
					{{ $t('common.showAll') }}
				</UButton>
			</div>

			<div class="flex gap-3 overflow-x-auto p-1 scrollbar-hide">
				<template v-if="categoriesLoading">
					<div
						v-for="item in 5"
						:key="`cat-skeleton-${item}`"
						class="flex flex-col items-center p-3 rounded-xl bg-gray-100 dark:bg-gray-800 min-w-[80px] animate-pulse"
					>
						<div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-2"></div>
						<div class="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
					</div>
				</template>

				<template v-else-if="categories && categories.length > 0">
					<CategoryCard
						v-for="category in categories"
						:key="category.$id"
						:category="category"
						:class="{ 'ring-2 ring-primary-500': selectedCategory?.$id === category.$id }"
						@select="handleCategorySelect"
					/>
				</template>
			</div>
		</div>

		<div v-if="productsLoading" class="space-y-4">
			<div class="flex items-center justify-between">
				<div class="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
				<div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div
					v-for="item in skeletonItems"
					:key="`prod-skeleton-${item}`"
					class="bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-pulse"
				>
					<div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
					<div class="p-4 space-y-2">
						<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
						<div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
						<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
					</div>
				</div>
			</div>
		</div>

		<div v-else class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					<template v-if="selectedCategory">
						{{ getCategoryName(selectedCategory, locale) }}
					</template>
					<template v-else>
						{{ $t('products.allProducts') }}
					</template>
				</h2>
				<span class="text-sm text-gray-500 dark:text-gray-400">
					{{ products.length }} {{ $t('products.items') }}
				</span>
			</div>

			<div v-if="products.length > 0" class="grid grid-cols-2 gap-4">
				<ProductCard v-for="product in products" :key="product.$id" :product="product" />
			</div>

			<div v-else class="grid grid-cols-2 gap-4">
				<div class="col-span-full text-center py-12">
					<div class="text-6xl mb-4">📦</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						{{ $t('products.empty.title') }}
					</h3>
					<p class="text-gray-600 dark:text-gray-400">
						{{ $t('products.empty.description') }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
</style>
