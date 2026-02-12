<script setup lang="ts">
import type { Category } from '~/types'
import { getCategoryName } from '~/utils/localization'

const { categories, loading: categoriesLoading, fetchCategories } = useCategories()
const { products, isLoading: productsLoading, fetchProducts } = useProducts()
const { locale } = useI18n()

const selectedCategory = ref<Category | null>(null)

const filteredProducts = computed(() => {
	if (!selectedCategory.value) return products.value
	return products.value.filter((p) => p.categoryId === selectedCategory.value?.$id)
})

const handleCategorySelect = (category: Category): void => {
	selectedCategory.value = category
}

const showAllProducts = (): void => {
	selectedCategory.value = null
}

onMounted(async () => {
	await Promise.all([fetchCategories(), fetchProducts()])
})
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

			<div class="flex gap-3 overflow-x-auto p-1 snap-x snap-mandatory scroll-smooth categories-scroll">
				<template v-if="categoriesLoading">
					<div
						v-for="i in 5"
						:key="`cat-skeleton-${i}`"
						class="flex flex-col items-center p-3 rounded-xl bg-gray-100 dark:bg-gray-800 min-w-[80px] snap-start"
					>
						<USkeleton class="w-12 h-12 rounded-full mb-2" />
						<USkeleton class="w-12 h-3 rounded" />
					</div>
				</template>

				<CategoryCard
					v-for="category in categories"
					v-else
					:key="category.$id"
					:category="category"
					:class="{ 'ring-2 ring-primary-500': selectedCategory?.$id === category.$id }"
					class="snap-start"
					@select="handleCategorySelect"
				/>
			</div>
		</div>

		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 v-if="!productsLoading" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					<template v-if="selectedCategory">
						{{ getCategoryName(selectedCategory, locale) }}
					</template>
					<template v-else>
						{{ $t('products.allProducts') }}
					</template>
				</h2>
				<USkeleton v-else class="h-6 w-32 rounded" />

				<span v-if="!productsLoading" class="text-sm text-gray-500 dark:text-gray-400">
					{{ filteredProducts.length }} {{ $t('products.items') }}
				</span>
				<USkeleton v-else class="h-4 w-20 rounded" />
			</div>

			<div v-if="productsLoading" class="grid grid-cols-2 gap-2">
				<div v-for="i in 6" :key="`prod-skeleton-${i}`" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
					<USkeleton class="aspect-square rounded-t-lg" />
					<div class="p-4 space-y-2">
						<USkeleton class="h-4 w-3/4 rounded" />
						<USkeleton class="h-3 w-1/2 rounded" />
						<USkeleton class="h-4 w-1/3 rounded" />
					</div>
				</div>
			</div>

			<div v-else-if="filteredProducts.length > 0" class="grid grid-cols-2 gap-2">
				<ProductCard v-for="product in filteredProducts" :key="product.$id" :product="product" />
			</div>

			<div v-else class="text-center py-12">
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
</template>

<style scoped>
.categories-scroll {
	-webkit-overflow-scrolling: touch;
	scrollbar-width: thin;
	scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.categories-scroll::-webkit-scrollbar {
	height: 4px;
}

.categories-scroll::-webkit-scrollbar-track {
	background: transparent;
}

.categories-scroll::-webkit-scrollbar-thumb {
	background-color: rgba(156, 163, 175, 0.3);
	border-radius: 2px;
}

.categories-scroll::-webkit-scrollbar-thumb:hover {
	background-color: rgba(156, 163, 175, 0.5);
}

.dark .categories-scroll {
	scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

.dark .categories-scroll::-webkit-scrollbar-thumb {
	background-color: rgba(75, 85, 99, 0.5);
}

.dark .categories-scroll::-webkit-scrollbar-thumb:hover {
	background-color: rgba(75, 85, 99, 0.7);
}
</style>
