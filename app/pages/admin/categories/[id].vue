<script setup lang="ts">
import type { UpdateCategoryData } from '~/types'

definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const route = useRoute()
const { t } = useI18n()
const { categories, loading, updateCategory, fetchAllCategories, getCategoryById } = useCategories()

const categoryId = route.params.id as string
const category = computed(() => getCategoryById(categoryId))

const handleSubmit = async (data: UpdateCategoryData | any) => {
	const result = await updateCategory(data as UpdateCategoryData)
	if (result) {
		await navigateTo('/admin/categories')
	}
}

const handleCancel = () => {
	navigateTo('/admin/categories')
}

onMounted(async () => {
	if (!categories.value) {
		await fetchAllCategories()
	}
})
</script>

<template>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
					{{ t('admin.categories.edit') }}
				</h1>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Edit category information</p>
			</div>
			<UButton :to="'/admin/categories'" icon="i-heroicons-arrow-left" color="neutral" variant="ghost">
				{{ t('common.back') }}
			</UButton>
		</div>

		<div v-if="loading" class="flex justify-center py-12">
			<UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
		</div>

		<div v-else-if="!category" class="text-center py-12">
			<UIcon name="i-heroicons-exclamation-triangle" class="mx-auto h-12 w-12 text-gray-400" />
			<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Category not found</h3>
			<p class="mt-1 text-sm text-gray-500">The category you're looking for doesn't exist or has been removed.</p>
			<UButton :to="'/admin/categories'" class="mt-4">
				{{ t('common.back') }}
			</UButton>
		</div>

		<UCard v-else>
			<AdminCategoryForm :category="category" :loading="loading" @submit="handleSubmit" @cancel="handleCancel" />
		</UCard>
	</div>
</template>
