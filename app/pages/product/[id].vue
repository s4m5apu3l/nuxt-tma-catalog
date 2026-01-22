<template>
	<div class="py-8">
		<ErrorBoundary @retry="retryFetch">
			<!-- Loading State -->
			<LoadingState v-if="isLoading" :text="$t('product.loading')" />

			<!-- Error State -->
			<ErrorAlert v-else-if="error" :error="error" :on-retry="retryFetch" @retry="retryFetch" />

			<!-- Product not found -->
			<EmptyState
				v-else-if="!product"
				icon="i-lucide-package-x"
				:title="$t('product.notFound.title')"
				:description="$t('product.notFound.description')"
				:primary-action="{
					label: $t('product.backToCategories'),
					onClick: () => navigateTo('/'),
					icon: 'i-lucide-arrow-left'
				}"
			/>

			<!-- Product Content -->
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
						<li v-if="category">
							<NuxtLink
								:to="`/category/${category.$id}`"
								class="text-primary-600 hover:text-primary-700 dark:text-primary-400"
							>
								{{ category.name }}
							</NuxtLink>
						</li>
						<li v-if="category" class="text-gray-400">/</li>
						<li class="text-gray-600 dark:text-gray-400">{{ product.title }}</li>
					</ol>
				</nav>

				<!-- Product Details -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<!-- Product Images -->
					<div class="space-y-4">
						<ImageGallery :images="product.images || []" :alt="product.title" />
					</div>

					<!-- Product Information -->
					<div class="space-y-6">
						<!-- Title and Price -->
						<div>
							<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
								{{ product.title }}
							</h1>
							<div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
								{{ formatPrice(product.price) }}
							</div>
						</div>

						<!-- Description -->
						<div v-if="product.description" class="prose dark:prose-invert max-w-none">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{{ $t('product.description') }}
							</h3>
							<p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
								{{ product.description }}
							</p>
						</div>

						<!-- Product Meta -->
						<div class="border-t pt-6 space-y-3">
							<div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
								<UIcon name="i-lucide-calendar" class="w-4 h-4 mr-2" />
								<span>{{ $t('product.addedOn') }}: {{ formatDate(product.$createdAt) }}</span>
							</div>

							<div v-if="category" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
								<UIcon name="i-lucide-tag" class="w-4 h-4 mr-2" />
								<span>{{ $t('product.category') }}:</span>
								<NuxtLink
									:to="`/category/${category.$id}`"
									class="ml-1 text-primary-600 hover:text-primary-700 dark:text-primary-400"
								>
									{{ category.name }}
								</NuxtLink>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="border-t pt-6 space-y-3">
							<!-- Share Error Alert -->
							<ErrorAlert
								v-if="shareError"
								:error="shareError"
								:show-retry="false"
								:on-dismiss="clearShareError"
								class="mb-3"
								@dismiss="clearShareError"
							/>

							<!-- Telegram Share Button -->
							<UButton
								color="primary"
								variant="outline"
								size="lg"
								icon="i-simple-icons-telegram"
								class="w-full"
								:loading="isSharing"
								:disabled="isSharing"
								@click="shareOnTelegram"
							>
								{{ isSharing ? $t('product.sharing') : $t('product.shareOnTelegram') }}
							</UButton>

							<!-- Back to Category Button -->
							<UButton
								v-if="category"
								variant="outline"
								size="lg"
								icon="i-lucide-arrow-left"
								class="w-full"
								@click="navigateTo(`/category/${category.$id}`)"
							>
								{{ $t('product.backToCategory', { category: category.name }) }}
							</UButton>
						</div>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	</div>
</template>

<script setup lang="ts">
import { useTelegramShare } from '~/composables/useTelegramShare'

import { useCategories } from '~/composables/useCategories'

import { useProducts } from '~/composables/useProducts'

interface Product {
	$id: string
	categoryId: string
	title: string
	description: string
	price: number
	images: string[]
	$createdAt: string
	$updatedAt: string
}

interface Category {
	$id: string
	name: string
	slug: string
	$createdAt: string
	$updatedAt: string
}

const route = useRoute()
const productId = route.params.id as string

// Composables
const { isLoading, error, getProductById, clearError } = useProducts()

const { getCategoryById } = useCategories()

const { shareProduct, isSharing, error: shareError, clearError: clearShareError } = useTelegramShare()

// Local state
const product = ref<Product | null>(null)
const category = ref<Category | null>(null)

// Fetch product and category data
const fetchData = async () => {
	clearError()

	// Fetch product details
	const productData = await getProductById(productId)
	product.value = productData

	// Fetch category details if product exists
	if (productData && productData.categoryId) {
		const categoryData = await getCategoryById(productData.categoryId)
		category.value = categoryData
	}
}

// Retry function for error state
const retryFetch = async () => {
	await fetchData()
}

// Format price with currency
const formatPrice = (price: number) => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB'
	}).format(price)
}

// Format date
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('ru-RU', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

// Share on Telegram
const shareOnTelegram = async () => {
	if (!product.value) return

	clearShareError()

	// Get current page URL
	const currentUrl = window.location.href

	// Share product using the composable
	const success = await shareProduct(
		{
			title: product.value.title,
			price: product.value.price,
			description: product.value.description
		},
		currentUrl
	)

	if (!success && shareError.value) {
		// Show error notification or handle error display
		console.error('Failed to share product:', shareError.value)
	}
}

// Fetch data on page load
onMounted(async () => {
	await fetchData()
})

// Watch for route changes
watch(
	() => route.params.id,
	async (newId) => {
		if (newId && newId !== productId) {
			await fetchData()
		}
	}
)

// SEO Meta
useSeoMeta({
	title: computed(() => (product.value ? `${product.value.title} - TMA Catalog` : 'Product - TMA Catalog')),
	description: computed(() =>
		product.value
			? product.value.description || `${product.value.title} - ${formatPrice(product.value.price)}`
			: 'Product details'
	)
})
</script>
