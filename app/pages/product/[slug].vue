<script setup lang="ts">
import type { Product } from '~/types'

const route = useRoute()
const { t, locale } = useI18n()
const { products, loading, fetchProducts, getProductBySlug } = useProducts()
const { categories, fetchCategories, getCategoryById } = useCategories()

const productSlug = route.params.slug as string
const product = ref<Product | null>(null)
const category = ref<any>(null)
const notFound = ref(false)

const loadProduct = async () => {
	if (!products.value) {
		await fetchProducts()
	}

	if (!categories.value) {
		await fetchCategories()
	}

	const foundProduct = getProductBySlug(productSlug)

	if (foundProduct) {
		product.value = foundProduct
		category.value = getCategoryById(foundProduct.categoryId)
	} else {
		notFound.value = true
	}
}

const breadcrumbs = computed(() => {
	if (!product.value || !category.value) return []

	return [
		{
			label: t('common.home'),
			to: '/'
		},
		{
			label: category.value.name[locale.value as 'en' | 'ru'],
			to: `/category/${category.value.slug}`
		},
		{
			label: product.value.name[locale.value as 'en' | 'ru']
		}
	]
})

const productName = computed(() => product.value?.name[locale.value as 'en' | 'ru'] || '')

const productDescription = computed(() => product.value?.description[locale.value as 'en' | 'ru'] || '')

const productFeatures = computed(() => product.value?.features[locale.value as 'en' | 'ru'] || [])

const formattedPrice = computed(() => (product.value ? formatPrice(product.value.price, product.value.priceUnit) : ''))

onMounted(async () => {
	await loadProduct()
})

// SEO Meta
useSeoMeta({
	title: () => (productName.value ? `${productName.value} - ${t('common.catalog')}` : t('common.catalog')),
	description: () => productDescription.value || t('common.catalog_description'),
	ogTitle: () => productName.value,
	ogDescription: () => productDescription.value,
	ogImage: () => (product.value?.images?.[0] ? getImageUrl(product.value.images[0]) : ''),
	twitterCard: 'summary_large_image'
})
</script>

<template>
	<div class="container mx-auto px-4 py-6">
		<div v-if="loading" class="space-y-6">
			<USkeleton class="h-4 w-64" />
			<USkeleton class="h-80 w-full" />
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<USkeleton class="h-96" />
				<div class="space-y-4">
					<USkeleton class="h-8 w-3/4" />
					<USkeleton class="h-6 w-1/2" />
					<USkeleton class="h-20 w-full" />
					<USkeleton class="h-12 w-full" />
				</div>
			</div>
		</div>

		<div v-else-if="notFound" class="text-center py-12">
			<UIcon name="i-lucide-package-x" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
				{{ t('product.not_found.title') }}
			</h1>
			<p class="text-gray-600 dark:text-gray-400 mb-6">
				{{ t('product.not_found.description') }}
			</p>
			<UButton to="/" icon="i-lucide-home">
				{{ t('common.back_to_home') }}
			</UButton>
		</div>

		<div v-else-if="product" class="space-y-6">
			<UBreadcrumb :links="breadcrumbs" />

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div class="space-y-4">
					<ProductGallery :images="product.images" :product-name="productName" />
				</div>

				<div class="space-y-6">
					<div class="space-y-2">
						<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
							{{ productName }}
						</h1>

						<div class="flex items-center gap-3">
							<span class="text-2xl font-bold text-primary">
								{{ formattedPrice }}
							</span>

							<UBadge v-if="!product.isAvailable" color="error" variant="soft" size="lg">
								{{ t('product.unavailable') }}
							</UBadge>

							<UBadge v-else color="success" variant="soft" size="lg">
								{{ t('product.available') }}
							</UBadge>
						</div>
					</div>

					<div v-if="category" class="flex items-center gap-2">
						<span class="text-sm text-gray-500">{{ t('product.category') }}:</span>
						<UButton :to="`/category/${category.slug}`" variant="ghost" size="sm" class="p-0 h-auto">
							{{ category.icon }} {{ category.name[locale] }}
						</UButton>
					</div>

					<div v-if="productDescription" class="space-y-2">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
							{{ t('product.description') }}
						</h3>
						<p class="text-gray-600 dark:text-gray-400 leading-relaxed">
							{{ productDescription }}
						</p>
					</div>

					<div v-if="productFeatures.length > 0" class="space-y-2">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
							{{ t('product.features') }}
						</h3>
						<ul class="space-y-1">
							<li
								v-for="feature in productFeatures"
								:key="feature"
								class="flex items-start gap-2 text-gray-600 dark:text-gray-400"
							>
								<UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
								<span>{{ feature }}</span>
							</li>
						</ul>
					</div>

					<div class="pt-4">
						<ContactButton :product="product" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
