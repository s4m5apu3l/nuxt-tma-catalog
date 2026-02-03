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
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
					{{ t('admin.categories.add') }}
				</h1>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new category for your products</p>
			</div>
			<UButton :to="'/admin/categories'" icon="i-heroicons-arrow-left" color="neutral" variant="ghost">
				{{ t('common.back') }}
			</UButton>
		</div>

		<UCard>
			<AdminCategoryForm :loading="loading" @submit="handleSubmit" @cancel="handleCancel" />
		</UCard>
	</div>
</template>
