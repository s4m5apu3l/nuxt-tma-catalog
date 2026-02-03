<script setup lang="ts">
import type { Category } from '~/types'

definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const { t } = useI18n()
const { categories, loading, error, fetchAllCategories, deleteCategory } = useCategories()

const searchQuery = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

const filteredCategories = computed(() => {
	if (!categories.value) return []

	return categories.value.filter((category) => {
		const matchesSearch = searchQuery.value
			? category.name.en.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
				category.name.ru.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
				category.slug.toLowerCase().includes(searchQuery.value.toLowerCase())
			: true

		const matchesStatus =
			statusFilter.value === 'all' ||
			(statusFilter.value === 'active' && category.isActive) ||
			(statusFilter.value === 'inactive' && !category.isActive)

		return matchesSearch && matchesStatus
	})
})

const statusOptions = [
	{ label: t('common.view_all'), value: 'all' },
	{ label: t('admin.dashboard.active'), value: 'active' },
	{ label: t('admin.dashboard.inactive'), value: 'inactive' }
]

const columns = [
	{
		key: 'name',
		label: t('admin.categories.name')
	},
	{
		key: 'slug',
		label: t('admin.categories.slug')
	},
	{
		key: 'status',
		label: 'Status'
	},
	{
		key: 'sortOrder',
		label: 'Sort Order'
	},
	{
		key: 'actions',
		label: t('admin.categories.actions')
	}
]

const handleDelete = async (category: Category) => {
	const confirmed = confirm(`${t('admin.categories.confirmDelete')}\n\n${t('admin.categories.deleteWarning')}`)

	if (confirmed) {
		await deleteCategory(category.$id)
	}
}

onMounted(() => {
	fetchAllCategories()
})
</script>

<template>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
					{{ t('admin.categories.title') }}
				</h1>
			</div>
			<UButton :to="'/admin/categories/create'" icon="i-heroicons-plus" color="primary">
				{{ t('admin.categories.add') }}
			</UButton>
		</div>

		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-4">
						<UInput
							v-model="searchQuery"
							icon="i-heroicons-magnifying-glass"
							:placeholder="t('common.search')"
							class="w-64"
						/>
						<USelect v-model="statusFilter" :options="statusOptions" class="w-40" />
					</div>
				</div>
			</template>

			<div v-if="loading" class="flex justify-center py-8">
				<UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6" />
			</div>

			<div v-else-if="error" class="text-center py-8">
				<p class="text-red-500">{{ error }}</p>
				<UButton class="mt-4" @click="fetchAllCategories()">
					{{ t('common.retry') }}
				</UButton>
			</div>

			<div v-else-if="!filteredCategories.length" class="text-center py-8">
				<div class="space-y-3">
					<UIcon name="i-heroicons-folder" class="mx-auto h-12 w-12 text-gray-400" />
					<h3 class="text-lg font-medium text-gray-900 dark:text-white">
						{{ t('admin.categories.empty.title') }}
					</h3>
					<p class="text-gray-500 dark:text-gray-400">
						{{ t('admin.categories.empty.description') }}
					</p>
					<UButton :to="'/admin/categories/create'" color="primary">
						{{ t('admin.categories.add') }}
					</UButton>
				</div>
			</div>

			<UTable v-else :rows="filteredCategories" :columns="columns as any">
				<template #name-data="{ row }">
					<div class="space-y-1">
						<div class="flex items-center space-x-2">
							<span class="text-lg">{{ (row as unknown as Category).icon }}</span>
							<span class="font-medium">{{ (row as unknown as Category).name.en }}</span>
						</div>
						<div class="text-sm text-gray-500">{{ (row as unknown as Category).name.ru }}</div>
					</div>
				</template>

				<template #slug-data="{ row }">
					<code class="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
						{{ (row as unknown as Category).slug }}
					</code>
				</template>

				<template #status-data="{ row }">
					<UBadge :color="(row as unknown as Category).isActive ? 'success' : 'error'" variant="subtle">
						{{
							(row as unknown as Category).isActive
								? t('admin.dashboard.active')
								: t('admin.dashboard.inactive')
						}}
					</UBadge>
				</template>

				<template #sortOrder-data="{ row }">
					<span class="text-sm text-gray-500">{{ (row as unknown as Category).sortOrder }}</span>
				</template>

				<template #actions-data="{ row }">
					<div class="flex items-center space-x-2">
						<UButton
							:to="`/admin/categories/${(row as unknown as Category).$id}`"
							icon="i-heroicons-pencil"
							size="sm"
							color="neutral"
							variant="ghost"
						>
							{{ t('common.edit') }}
						</UButton>
						<UButton
							icon="i-heroicons-trash"
							size="sm"
							color="error"
							variant="ghost"
							@click="handleDelete(row as unknown as Category)"
						>
							{{ t('common.delete') }}
						</UButton>
					</div>
				</template>
			</UTable>
		</UCard>
	</div>
</template>
