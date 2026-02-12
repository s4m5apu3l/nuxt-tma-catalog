<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const { t, locale } = useI18n()
const { products, loading, error, fetchProducts, deleteProduct } = useProducts()

const searchQuery = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

const filteredProducts = computed(() => {
	if (!products.value) return []

	return products.value.filter((product) => {
		const matchesSearch = searchQuery.value
			? product.name.en.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
				product.name.ru.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
				product.slug.toLowerCase().includes(searchQuery.value.toLowerCase())
			: true

		const matchesStatus =
			statusFilter.value === 'all' ||
			(statusFilter.value === 'active' && product.isActive) ||
			(statusFilter.value === 'inactive' && !product.isActive)

		return matchesSearch && matchesStatus
	})
})

const statusOptions = [
	{ label: t('common.view_all'), value: 'all' },
	{ label: t('admin.dashboard.active'), value: 'active' },
	{ label: t('admin.dashboard.inactive'), value: 'inactive' }
]

const handleDelete = async (product: Product) => {
	const localeValue = locale.value as 'en' | 'ru'
	const confirmed = confirm(`${t('admin.products.confirmDelete')}\n\n${product.name[localeValue] || product.name.en}`)

	if (confirmed) {
		await deleteProduct(product.$id)
	}
}

onMounted(() => {
	fetchProducts()
})
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h1 class="text-xl font-bold text-gray-900 dark:text-white">
				{{ t('admin.products.title') }}
			</h1>
			<UButton :to="'/admin/products/create'" icon="i-heroicons-plus" color="primary" size="sm">
				{{ t('admin.products.add') }}
			</UButton>
		</div>

		<div class="flex flex-col space-y-2">
			<UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" :placeholder="t('common.search')" />
			<USelect v-model="statusFilter" :items="statusOptions" />
		</div>

		<div class="space-y-2">
			<template v-if="loading">
				<UCard v-for="i in 3" :key="i">
					<div class="flex items-center space-x-3">
						<USkeleton class="w-16 h-16 rounded" />
						<div class="flex-1 space-y-2">
							<USkeleton class="h-4 w-3/4" />
							<USkeleton class="h-3 w-1/2" />
						</div>
					</div>
				</UCard>
			</template>

			<template v-else-if="error">
				<UCard>
					<div class="text-center py-6">
						<p class="text-red-500 text-sm mb-3">{{ error }}</p>
						<UButton size="sm" @click="fetchProducts()">
							{{ t('common.retry') }}
						</UButton>
					</div>
				</UCard>
			</template>

			<template v-else-if="!filteredProducts.length">
				<UCard>
					<div class="text-center py-8">
						<UIcon name="i-heroicons-cube" class="mx-auto h-10 w-10 text-gray-400 mb-3" />
						<h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">
							{{ t('admin.products.empty.title') }}
						</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
							{{ t('admin.products.empty.description') }}
						</p>
						<UButton :to="'/admin/products/create'" color="primary" size="sm">
							{{ t('admin.products.add') }}
						</UButton>
					</div>
				</UCard>
			</template>

			<UCard
				v-for="product in filteredProducts"
				v-else
				:key="product.$id"
				class="cursor-pointer active:scale-[0.98] transition-transform"
				@click="navigateTo(`/admin/products/${product.$id}`)"
			>
				<div class="flex items-center space-x-3">
					<div class="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
						<UIcon name="i-lucide-package" class="w-6 h-6 text-muted-foreground" />
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center space-x-2">
							<p class="font-medium text-foreground truncate">
								{{ product.name[locale] || product.name.en }}
							</p>
							<UBadge :color="product.isActive ? 'success' : 'error'" variant="soft" size="xs">
								{{ product.isActive ? t('admin.dashboard.active') : t('admin.dashboard.inactive') }}
							</UBadge>
						</div>
						<p class="text-sm text-muted-foreground">
							{{ formatPricing(product.pricing, locale) }}
						</p>
						<code class="text-xs text-muted-foreground">{{ product.slug }}</code>
					</div>
					<UButton
						icon="i-heroicons-trash"
						size="xs"
						color="error"
						variant="ghost"
						@click.stop="handleDelete(product)"
					/>
				</div>
			</UCard>
		</div>
	</div>
</template>
