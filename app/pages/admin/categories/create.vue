<script setup lang="ts">
import type { CreateCategoryData } from '~/types'

definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const { t } = useI18n()
const { createCategory, loading } = useCategories()

const handleSubmit = async (data: CreateCategoryData | any) => {
	const result = await createCategory(data as CreateCategoryData)
	if (result) {
		await navigateTo('/admin/categories')
	}
}

const handleCancel = () => {
	navigateTo('/admin/categories')
}
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center space-x-3">
			<UButton icon="i-lucide-arrow-left" variant="ghost" size="sm" to="/admin/categories" />
			<h1 class="text-xl font-bold text-foreground">
				{{ t('admin.categories.add') }}
			</h1>
		</div>

		<CategoryForm :loading="loading" @submit="handleSubmit" @cancel="handleCancel" />
	</div>
</template>
