<script setup lang="ts">
import type { CreateProductData } from '~/types'

definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const productId = route.params.id as string

const { product, isLoading: productLoading, fetchProduct, updateProduct } = useProducts()

const isSubmitting = ref(false)

const handleSubmit = async (data: CreateProductData) => {
	isSubmitting.value = true
	try {
		await updateProduct(productId, data)
		toast.add({
			title: t('admin.products.updateSuccess'),
			color: 'green'
		})
		await router.push('/admin/products')
	} catch (error) {
		toast.add({
			title: t('admin.products.updateError'),
			description: error instanceof Error ? error.message : t('common.unknownError'),
			color: 'red'
		})
	} finally {
		isSubmitting.value = false
	}
}

const handleCancel = () => {
	router.push('/admin/products')
}

onMounted(async () => {
	try {
		await fetchProduct(productId)
	} catch (error) {
		toast.add({
			title: t('admin.products.loadError'),
			description: error instanceof Error ? error.message : t('common.unknownError'),
			color: 'red'
		})
		await router.push('/admin/products')
	}
})
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center space-x-3">
			<UButton icon="i-lucide-arrow-left" variant="ghost" size="sm" to="/admin/products" />
			<h1 class="text-xl font-bold text-foreground">
				{{ t('admin.products.edit') }}
			</h1>
		</div>

		<div v-if="productLoading" class="space-y-4">
			<UCard v-for="i in 3" :key="i">
				<div class="space-y-4 animate-pulse">
					<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
					<div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
					<div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
				</div>
			</UCard>
		</div>

		<ProductForm
			v-else-if="product"
			:product="product"
			:loading="isSubmitting"
			@submit="handleSubmit"
			@cancel="handleCancel"
		/>
	</div>
</template>
