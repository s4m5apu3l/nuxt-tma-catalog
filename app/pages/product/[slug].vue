<script setup lang="ts">
import { useBackButton } from 'vue-tg'
import type { Product } from '~/types'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { products, loading, fetchProducts, getProductBySlug } = useProducts()
// const { showBackButton, hideBackButton } = useTelegram()

const productSlug = route.params.slug as string
const product = ref<Product | null>(null)
const notFound = ref(false)

const loadProduct = async () => {
	// Сначала проверяем кеш
	const cachedProduct = getProductBySlug(productSlug)

	if (cachedProduct) {
		product.value = cachedProduct
		return
	}

	// Если нет в кеше, загружаем все продукты один раз
	if (!products.value || products.value.length === 0) {
		await fetchProducts()
	}

	// Ищем продукт после загрузки
	const foundProduct = getProductBySlug(productSlug)

	if (foundProduct) {
		product.value = foundProduct
	} else {
		notFound.value = true
	}
}

const goBack = () => {
	useBackButton().hide?.()
	router.back()
}

const productName = computed(() => product.value?.name[locale.value as 'en' | 'ru'] || '')
const productDescription = computed(() => product.value?.description[locale.value as 'en' | 'ru'] || '')
const productFeatures = computed(() => product.value?.features[locale.value as 'en' | 'ru'] || [])

const formattedPrice = computed(() => {
	if (!product.value?.pricing || product.value.pricing.length === 0) {
		return t('product.priceOnRequest')
	}
	return formatPricing(product.value.pricing, locale.value)
})

const allPrices = computed(() => {
	if (!product.value?.pricing || product.value.pricing.length === 0) return []
	return formatPricingFull(product.value.pricing, locale.value)
})

onMounted(async () => {
	await loadProduct()
	useBackButton().show?.()
	useBackButton().onClick?.(() => {
		// router.back()
		window.history.back()
	})
})

onBeforeUnmount(() => {
	useBackButton().hide?.()
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
	<div class="container">
		<div v-if="loading || (!product && !notFound)" class="space-y-6">
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

		<div v-else-if="product">
			<UButton icon="i-lucide-arrow-left" variant="ghost" size="sm" class="mb-4" @click="goBack">
				{{ t('common.back') }}
			</UButton>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div>
					<UCarousel
						v-if="product.images.length > 0"
						v-slot="{ item }"
						:items="product.images.map((id) => getImageUrl(id))"
						:ui="{
							item: 'basis-full',
							container: 'aspect-square'
						}"
						arrows
						indicators
					>
						<div class="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
							<img :src="item" :alt="productName" class="w-full h-full object-cover" loading="lazy" />
						</div>
					</UCarousel>

					<div
						v-else
						class="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center"
					>
						<UIcon name="i-lucide-image" class="w-16 h-16 text-gray-400" />
					</div>
				</div>

				<div class="space-y-6">
					<div class="space-y-4">
						<UBadge v-if="product.isAvailable" color="success" variant="soft" size="lg" class="shrink-0">
							{{ t('product.available') }}
						</UBadge>
						<UBadge v-else color="error" variant="soft" size="lg" class="shrink-0">
							{{ t('product.unavailable') }}
						</UBadge>
						<div class="flex items-start justify-between gap-4">
							<h1 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight flex-1">
								{{ productName }}
							</h1>
						</div>

						<div class="space-y-3">
							<div class="text-3xl font-bold text-gray-900 dark:text-orange-300">
								{{ formattedPrice }}
							</div>
							<div v-if="allPrices.length > 1" class="flex flex-wrap gap-2">
								<UBadge
									v-for="(price, index) in allPrices"
									:key="index"
									color="neutral"
									variant="soft"
									size="lg"
								>
									{{ price }}
								</UBadge>
							</div>
						</div>
					</div>

					<div v-if="productDescription" class="space-y-2">
						<h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
							{{ t('product.description') }}
						</h2>
						<p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
							{{ productDescription }}
						</p>
					</div>

					<div v-if="productFeatures.length > 0" class="space-y-3">
						<h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
							{{ t('product.features') }}
						</h2>
						<ul class="space-y-2.5">
							<li
								v-for="(feature, index) in productFeatures"
								:key="index"
								class="flex items-start gap-3 text-gray-700 dark:text-gray-300"
							>
								<UIcon
									name="i-lucide-check"
									class="w-5 h-5 text-green-600 dark:text-green-500 shrink-0 mt-0.5"
								/>
								<span>{{ feature }}</span>
							</li>
						</ul>
					</div>

					<div class="pt-6">
						<ContactButton :product="product" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
