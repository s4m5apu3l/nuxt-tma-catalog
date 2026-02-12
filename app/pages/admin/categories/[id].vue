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
	<div class="space-y-4">
		<div class="flex items-center space-x-3">
			<UButton icon="i-lucide-arrow-left" variant="ghost" size="sm" to="/admin/categories" />
			<h1 class="text-xl font-bold text-foreground">
				{{ t('admin.categories.edit') }}
			</h1>
		</div>

		<div v-if="loading" class="flex justify-center py-12">
			<UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
		</div>

		<div v-else-if="!category" class="text-center py-12">
			<UIcon name="i-heroicons-exclamation-triangle" class="mx-auto h-12 w-12 text-gray-400" />
			<h3 class="mt-2 text-sm font-medium text-foreground">Category not found</h3>
			<p class="mt-1 text-sm text-muted-foreground">
				The category you're looking for doesn't exist or has been removed.
			</p>
			<UButton to="/admin/categories" class="mt-4">
				{{ t('common.back') }}
			</UButton>
		</div>

		<CategoryForm v-else :category="category" :loading="loading" @submit="handleSubmit" @cancel="handleCancel" />
	</div>
</template>
