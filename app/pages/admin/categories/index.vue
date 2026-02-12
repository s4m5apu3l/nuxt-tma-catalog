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
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h1 class="text-xl font-bold text-gray-900 dark:text-white">
				{{ t('admin.categories.title') }}
			</h1>
			<UButton :to="'/admin/categories/create'" icon="i-heroicons-plus" color="primary" size="sm">
				{{ t('admin.categories.add') }}
			</UButton>
		</div>

		<div class="flex flex-col space-y-2">
			<UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" :placeholder="t('common.search')" />
			<USelect v-model="statusFilter" :options="statusOptions" />
		</div>

		<div class="space-y-2">
			<template v-if="loading">
				<UCard v-for="i in 3" :key="i">
					<div class="flex items-center space-x-3">
						<USkeleton class="w-10 h-10 rounded" />
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
						<UButton size="sm" @click="fetchAllCategories()">
							{{ t('common.retry') }}
						</UButton>
					</div>
				</UCard>
			</template>

			<template v-else-if="!filteredCategories.length">
				<UCard>
					<div class="text-center py-8">
						<UIcon name="i-heroicons-folder" class="mx-auto h-10 w-10 text-gray-400 mb-3" />
						<h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">
							{{ t('admin.categories.empty.title') }}
						</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
							{{ t('admin.categories.empty.description') }}
						</p>
						<UButton :to="'/admin/categories/create'" color="primary" size="sm">
							{{ t('admin.categories.add') }}
						</UButton>
					</div>
				</UCard>
			</template>

			<UCard
				v-for="category in filteredCategories"
				v-else
				:key="category.$id"
				class="cursor-pointer active:scale-[0.98] transition-transform"
				@click="navigateTo(`/admin/categories/${category.$id}`)"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-3 flex-1 min-w-0">
						<div class="text-2xl shrink-0">{{ category.icon }}</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center space-x-2">
								<p class="font-medium text-foreground truncate">{{ category.name.en }}</p>
								<UBadge :color="category.isActive ? 'success' : 'error'" variant="soft" size="xs">
									{{
										category.isActive ? t('admin.dashboard.active') : t('admin.dashboard.inactive')
									}}
								</UBadge>
							</div>
							<p class="text-sm text-muted-foreground truncate">{{ category.name.ru }}</p>
							<code class="text-xs text-muted-foreground">{{ category.slug }}</code>
						</div>
					</div>
					<div class="flex items-center space-x-1 shrink-0">
						<UButton
							icon="i-heroicons-trash"
							size="xs"
							color="error"
							variant="ghost"
							@click.stop="handleDelete(category)"
						/>
					</div>
				</div>
			</UCard>
		</div>
	</div>
</template>
