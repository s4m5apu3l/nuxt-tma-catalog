<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { categories, fetchCategories, getCategoryBySlug } = useCategories()
const { products, loading, fetchProducts } = useProducts()

const categorySlug = route.params.slug as string

const category = computed(() => getCategoryBySlug(categorySlug))
const categoryName = computed(() => (category.value ? category.value.name[locale.value as 'en' | 'ru'] : ''))

const availabilityFilter = ref<'all' | 'available' | 'unavailable'>('all')

const filteredProducts = computed(() => {
	if (!products.value) return []

	let filtered = products.value

	if (availabilityFilter.value === 'available') {
		filtered = filtered.filter((p) => p.isAvailable)
	} else if (availabilityFilter.value === 'unavailable') {
		filtered = filtered.filter((p) => !p.isAvailable)
	}

	return filtered
})

const skeletonItems = Array.from({ length: 6 }, (_, i) => i)

const filterOptions = computed(() => [
	{ label: 'All Products', value: 'all' },
	{ label: 'Available', value: 'available' },
	{ label: 'Unavailable', value: 'unavailable' }
])

onMounted(async () => {
	if (!categories.value) {
		fetchCategories()
	}

	const cat = getCategoryBySlug(categorySlug)
	if (cat) {
		fetchProducts(cat.$id)
	}
})

watch(
	() => categorySlug,
	async (newSlug) => {
		const cat = getCategoryBySlug(newSlug)
		if (cat) {
			await fetchProducts(cat.$id)
		}
	}
)

useHead({
	title: computed(() => categoryName.value || 'Category'),
	meta: [
		{
			name: 'description',
			content: computed(() =>
				category.value
					? category.value.description[locale.value as 'en' | 'ru']
					: 'Browse products in this category'
			)
		}
	]
})
</script>

<template>
	<div class="space-y-6">
		<nav class="flex items-center space-x-2 text-sm">
			<NuxtLink to="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
				{{ $t('category.backToCategories') }}
			</NuxtLink>
			<UIcon name="i-lucide-chevron-right" class="text-gray-400" />
			<span class="text-gray-900 dark:text-gray-100 font-medium">
				{{ categoryName }}
			</span>
		</nav>

		<div v-if="category" class="space-y-4">
			<div class="flex items-center space-x-4">
				<div class="text-4xl">{{ category.icon }}</div>
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
						{{ categoryName }}
					</h1>
					<p class="text-gray-600 dark:text-gray-400 mt-2">
						{{ category.description[locale as 'en' | 'ru'] }}
					</p>
				</div>
			</div>
		</div>

		<div v-else-if="!category && !loading" class="text-center py-12">
			<div class="text-6xl mb-4">❓</div>
			<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
				{{ $t('category.notFound.title') }}
			</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-4">
				{{ $t('category.notFound.description') }}
			</p>
			<UButton to="/" variant="outline">
				{{ $t('category.backToCategories') }}
			</UButton>
		</div>

		<div v-if="category" class="flex items-center justify-between">
			<div class="flex items-center space-x-4">
				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by availability:</span>
				<USelectMenu
					v-model="availabilityFilter"
					:options="filterOptions"
					value-attribute="value"
					option-attribute="label"
				/>
			</div>

			<div class="text-sm text-gray-500 dark:text-gray-400">
				{{ $t('category.productsDescription', { count: filteredProducts.length }) }}
			</div>
		</div>

		<div v-if="category" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<template v-if="loading">
				<ProductSkeleton v-for="item in skeletonItems" :key="`skeleton-${item}`" />
			</template>

			<template v-else-if="filteredProducts.length > 0">
				<ProductCard v-for="product in filteredProducts" :key="product.$id" :product="product" />
			</template>

			<template v-else>
				<div class="col-span-full text-center py-12">
					<div class="text-6xl mb-4">📦</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						{{ $t('products.empty.title') }}
					</h3>
					<p class="text-gray-600 dark:text-gray-400">
						{{ $t('products.empty.description') }}
					</p>
				</div>
			</template>
		</div>
	</div>
</template>
