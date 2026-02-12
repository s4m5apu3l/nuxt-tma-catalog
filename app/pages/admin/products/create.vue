<script setup lang="ts">
import type { CreateProductData } from '~/types'

definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const { t } = useI18n()
const { createProduct } = useProducts()
const toast = useToast()
const router = useRouter()

const isLoading = ref(false)

const handleSubmit = async (data: CreateProductData) => {
	isLoading.value = true
	try {
		await createProduct(data)
		toast.add({
			title: t('admin.products.createSuccess'),
			color: 'success'
		})
		await router.push('/admin/products')
	} catch (error) {
		toast.add({
			title: t('admin.products.createError'),
			description: error instanceof Error ? error.message : t('common.unknownError'),
			color: 'error'
		})
	} finally {
		isLoading.value = false
	}
}

const handleCancel = () => {
	router.push('/admin/products')
}
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center space-x-3">
			<UButton icon="i-lucide-arrow-left" variant="ghost" size="sm" to="/admin/products" />
			<h1 class="text-xl font-bold text-foreground">
				{{ t('admin.products.create') }}
			</h1>
		</div>

		<ProductForm :loading="isLoading" @submit="handleSubmit" @cancel="handleCancel" />
	</div>
</template>
