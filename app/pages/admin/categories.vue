<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="border-b border-gray-200 pb-5">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
						{{ $t('admin.categories.title') }}
					</h1>
				</div>
				<div class="flex items-center space-x-3">
					<UButton @click="showCreateModal = true" icon="i-lucide-plus">
						{{ $t('admin.categories.add') }}
					</UButton>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="isLoading" class="flex justify-center py-12">
			<Icon name="i-lucide-loader-2" class="h-8 w-8 animate-spin text-gray-400" />
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="rounded-md bg-red-50 p-4">
			<div class="flex">
				<Icon name="i-lucide-alert-circle" class="h-5 w-5 text-red-400" />
				<div class="ml-3">
					<p class="text-sm text-red-800">{{ error }}</p>
					<div class="mt-2">
						<UButton @click="fetchCategories" size="sm" variant="outline">
							{{ $t('common.retry') }}
						</UButton>
					</div>
				</div>
			</div>
		</div>

		<!-- Categories List -->
		<div v-else-if="categories.length > 0" class="bg-white shadow overflow-hidden sm:rounded-md">
			<ul class="divide-y divide-gray-200">
				<li v-for="category in categories" :key="category.$id" class="px-6 py-4">
					<div class="flex items-center justify-between">
						<div class="flex-1 min-w-0">
							<div class="flex items-center space-x-3">
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium text-gray-900 truncate">
										{{ category.name }}
									</p>
									<p class="text-sm text-gray-500 truncate">
										{{ category.slug }}
									</p>
								</div>
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<UButton @click="editCategory(category)" size="sm" variant="outline" icon="i-lucide-edit">
								{{ $t('common.edit') }}
							</UButton>
							<UButton
								size="sm"
								color="error"
								variant="outline"
								icon="i-lucide-trash"
								@click="confirmDelete(category)"
							>
								{{ $t('common.delete') }}
							</UButton>
						</div>
					</div>
				</li>
			</ul>
		</div>

		<!-- Empty State -->
		<div v-else class="text-center py-12">
			<Icon name="i-lucide-folder" class="mx-auto h-12 w-12 text-gray-400" />
			<h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('admin.categories.empty.title') }}</h3>
			<p class="mt-1 text-sm text-gray-500">{{ $t('admin.categories.empty.description') }}</p>
			<div class="mt-6">
				<UButton @click="showCreateModal = true" icon="i-lucide-plus">
					{{ $t('admin.categories.add') }}
				</UButton>
			</div>
		</div>

		<!-- Create/Edit Modal -->
		<UModal v-model="showCreateModal">
			<UCard>
				<template #header>
					<h3 class="text-lg font-medium">
						{{ editingCategory ? $t('admin.categories.edit') : $t('admin.categories.add') }}
					</h3>
				</template>

				<form class="space-y-4" @submit.prevent="handleSubmit">
					<div>
						<ULabel for="name">{{ $t('admin.categories.name') }}</ULabel>
						<UInput
							id="name"
							v-model="formState.name"
							:placeholder="$t('admin.categories.name')"
							@input="generateSlugFromName"
							required
						/>
					</div>

					<div>
						<ULabel for="slug">{{ $t('admin.categories.slug') }}</ULabel>
						<UInput
							id="slug"
							v-model="formState.slug"
							:placeholder="$t('admin.categories.slug')"
							required
						/>
					</div>

					<div class="flex justify-end space-x-3 pt-4">
						<UButton variant="outline" @click="closeModal">
							{{ $t('common.cancel') }}
						</UButton>
						<UButton type="submit" :loading="isLoading">
							{{ $t('common.save') }}
						</UButton>
					</div>
				</form>
			</UCard>
		</UModal>

		<!-- Delete Confirmation Modal -->
		<UModal v-model="showDeleteModal">
			<UCard>
				<template #header>
					<h3 class="text-lg font-medium text-red-600">
						{{ $t('admin.categories.delete') }}
					</h3>
				</template>

				<div class="space-y-4">
					<p class="text-sm text-gray-600">
						{{ $t('admin.categories.confirmDelete') }}
					</p>
					<p class="text-sm text-red-600 font-medium">
						{{ $t('admin.categories.deleteWarning') }}
					</p>
				</div>

				<template #footer>
					<div class="flex justify-end space-x-3">
						<UButton @click="showDeleteModal = false" variant="outline">
							{{ $t('common.cancel') }}
						</UButton>
						<UButton @click="handleDelete" :loading="isLoading" color="error">
							{{ $t('common.delete') }}
						</UButton>
					</div>
				</template>
			</UCard>
		</UModal>
	</div>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useCategories'

// Set page meta
definePageMeta({
	middleware: 'auth'
})

// Use composables
const {
	categories,
	isLoading,
	error,
	fetchCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	generateSlug,
	clearError
} = useCategories()
const { t } = useI18n()
const toast = useToast()

// Modal states
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const editingCategory = ref<Category | null>(null)
const deletingCategory = ref<Category | null>(null)

// Form state
const formState = reactive({
	name: '',
	slug: ''
})

// Validate form
const validateForm = () => {
	if (!formState.name.trim()) {
		return 'Category name is required'
	}
	if (formState.name.length > 100) {
		return 'Name too long'
	}
	if (!formState.slug.trim()) {
		return 'Slug is required'
	}
	if (formState.slug.length > 100) {
		return 'Slug too long'
	}
	if (!/^[a-z0-9-]+$/.test(formState.slug)) {
		return 'Slug can only contain lowercase letters, numbers, and hyphens'
	}
	return null
}

// Generate slug from name
const generateSlugFromName = () => {
	if (formState.name && !editingCategory.value) {
		formState.slug = generateSlug(formState.name)
	}
}

// Edit category
const editCategory = (category: Category) => {
	editingCategory.value = category
	formState.name = category.name
	formState.slug = category.slug
	showCreateModal.value = true
}

// Confirm delete
const confirmDelete = (category: Category) => {
	deletingCategory.value = category
	showDeleteModal.value = true
}

// Handle form submit
const handleSubmit = async () => {
	clearError()

	const validationError = validateForm()
	if (validationError) {
		toast.add({
			title: validationError,
			color: 'error'
		})
		return
	}

	let success = false

	if (editingCategory.value) {
		// Update existing category
		const result = await updateCategory(editingCategory.value.$id, {
			name: formState.name,
			slug: formState.slug
		})
		success = !!result

		if (success) {
			toast.add({
				title: t('admin.categories.updated'),
				color: 'success'
			})
		}
	} else {
		// Create new category
		const result = await createCategory({
			name: formState.name,
			slug: formState.slug
		})
		success = !!result

		if (success) {
			toast.add({
				title: t('admin.categories.created'),
				color: 'success'
			})
		}
	}

	if (success) {
		closeModal()
	} else if (error.value) {
		toast.add({
			title: error.value,
			color: 'error'
		})
	}
}

// Handle delete
const handleDelete = async () => {
	if (!deletingCategory.value) return

	clearError()
	const success = await deleteCategory(deletingCategory.value.$id)

	if (success) {
		toast.add({
			title: t('admin.categories.deleted'),
			color: 'success'
		})
		showDeleteModal.value = false
		deletingCategory.value = null
	} else if (error.value) {
		toast.add({
			title: error.value,
			color: 'error'
		})
	}
}

// Close modal
const closeModal = () => {
	showCreateModal.value = false
	editingCategory.value = null
	formState.name = ''
	formState.slug = ''
}

// Fetch categories on mount
onMounted(() => {
	fetchCategories()
})

// Set page title
useHead({
	title: t('admin.categories.title')
})
</script>
