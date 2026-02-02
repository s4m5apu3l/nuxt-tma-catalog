<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const { categories, fetchCategories, getCategoryById } = useCategories()
const { products, loading, fetchAllProducts, getProductBySlug } = useProducts()

const productSlug = route.params.slug as string

const product = computed(() => getProductBySlug(productSlug))
const productName = computed(() => (product.value ? product.value.name[locale.value as 'en' | 'ru'] : ''))
const productDescription = computed(() => (product.value ? product.value.description[locale.value as 'en' | 'ru'] : ''))

// Get category info
const category = computed(() => (product.value ? getCategoryById(product.value.categoryId) : null))
const categoryName = computed(() => (category.value ? category.value.name[locale.value as 'en' | 'ru'] : ''))

// Product features
const productFeatures = computed(() => (product.value ? product.value.features[locale.value as 'en' | 'ru'] : []))

// Format price
const formatPrice = (price: number, unit: string) => {
	return `${price} ${unit}`
}

// Format date
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString(locale.value)
}

onMounted(async () => {
	if (!categories.value) {
		await fetchCategories()
	}
	if (!products.value) {
		await fetchAllProducts()
	}
})

// SEO
useHead({
	title: computed(() => productName.value || 'Product'),
	meta: [
		{
			name: 'description',
			content: computed(() => productDescription.value || 'Product details')
		}
	]
})
</script>

<template>
	<div class="space-y-6">
		<div v-if="loading" class="space-y-6">
			<div class="flex items-center space-x-2">
				<USkeleton class="h-4 w-32" />
				<USkeleton class="h-4 w-4" />
				<USkeleton class="h-4 w-24" />
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<USkeleton class="aspect-square w-full rounded-lg" />
				<div class="space-y-4">
					<USkeleton class="h-8 w-3/4" />
					<USkeleton class="h-6 w-1/2" />
					<USkeleton class="h-4 w-full" />
					<USkeleton class="h-4 w-full" />
					<USkeleton class="h-4 w-2/3" />
					<USkeleton class="h-12 w-full" />
				</div>
			</div>
		</div>

		<div v-else-if="!product" class="text-center py-12">
			<div class="text-6xl mb-4">❓</div>
			<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
				{{ $t('product.notFound.title') }}
			</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-4">
				{{ $t('product.notFound.description') }}
			</p>
			<UButton to="/" variant="outline">
				{{ $t('product.backToCategories') }}
			</UButton>
		</div>

		<div v-else class="space-y-6">
			<nav class="flex items-center space-x-2 text-sm">
				<NuxtLink to="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
					{{ $t('product.backToCategories') }}
				</NuxtLink>
				<UIcon name="i-lucide-chevron-right" class="text-gray-400" />
				<NuxtLink
					v-if="category"
					:to="`/category/${category.slug}`"
					class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					{{ categoryName }}
				</NuxtLink>
				<UIcon v-if="category" name="i-lucide-chevron-right" class="text-gray-400" />
				<span class="text-gray-900 dark:text-gray-100 font-medium">
					{{ productName }}
				</span>
			</nav>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div class="space-y-4">
					<ProductGallery :images="product.images" :product-name="productName" />
				</div>

				<div class="space-y-6">
					<div class="space-y-2">
						<div class="flex items-start justify-between">
							<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
								{{ productName }}
							</h1>
							<UBadge v-if="!product.isAvailable" color="error" variant="solid" class="ml-4">
								{{ $t('product.unavailable') }}
							</UBadge>
						</div>

						<div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
							<span>{{ $t('product.category') }}:</span>
							<NuxtLink
								v-if="category"
								:to="`/category/${category.slug}`"
								class="text-primary hover:underline"
							>
								{{ categoryName }}
							</NuxtLink>
						</div>
					</div>

					<div class="space-y-2">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{{ $t('product.price') }}
						</h3>
						<div class="text-3xl font-bold text-primary">
							{{ formatPrice(product.price, product.priceUnit) }}
						</div>
					</div>

					<div v-if="productDescription" class="space-y-2">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{{ $t('product.description') }}
						</h3>
						<div class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
							{{ productDescription }}
						</div>
					</div>

					<div v-if="productFeatures.length > 0" class="space-y-2">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{{ $t('product.features') }}
						</h3>
						<ul class="space-y-1">
							<li
								v-for="(feature, index) in productFeatures"
								:key="index"
								class="flex items-start space-x-2 text-gray-600 dark:text-gray-400"
							>
								<UIcon name="i-lucide-check" class="text-green-500 mt-0.5 shrink-0" />
								<span>{{ feature }}</span>
							</li>
						</ul>
					</div>

					<div class="text-sm text-gray-500 dark:text-gray-400">
						{{ $t('product.addedOn') }}: {{ formatDate(product.createdAt) }}
					</div>

					<div class="pt-4">
						<ContactButton :product="product" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
