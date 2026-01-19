<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Navigation Header -->
		<nav class="bg-white shadow-sm border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between h-16">
					<div class="flex items-center space-x-4">
						<UButton to="/admin" color="gray" variant="ghost" icon="i-heroicons-arrow-left">
							Back to Dashboard
						</UButton>
						<h1 class="text-xl font-semibold text-gray-900">Category Management</h1>
					</div>

					<div class="flex items-center space-x-4">
						<UButton @click="openCreateModal" color="primary" icon="i-heroicons-plus">Add Category</UButton>
						<UButton
							@click="handleLogout"
							:loading="authLoading"
							color="red"
							variant="ghost"
							icon="i-heroicons-arrow-right-on-rectangle"
						>
							Logout
						</UButton>
					</div>
				</div>
			</div>
		</nav>

		<!-- Main Content -->
		<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			<div class="px-4 py-6 sm:px-0">
				<!-- Error Alert -->
				<div v-if="error" class="mb-6">
					<UAlert
						color="red"
						variant="soft"
						:title="error"
						:close-button="{
							icon: 'i-heroicons-x-mark-20-solid',
							color: 'gray',
							variant: 'link',
							padded: false
						}"
						@close="clearError"
					/>
				</div>

				<!-- Categories List -->
				<div class="bg-white shadow rounded-lg">
					<div class="px-6 py-4 border-b border-gray-200">
						<h3 class="text-lg font-medium text-gray-900">Categories</h3>
					</div>

					<!-- Loading State -->
					<div v-if="isLoading && categories.length === 0" class="p-6">
						<div class="animate-pulse space-y-4">
							<div v-for="i in 3" :key="i" class="h-16 bg-gray-200 rounded"></div>
						</div>
					</div>

					<!-- Empty State -->
					<div v-else-if="!isLoading && categories.length === 0" class="p-6 text-center">
						<UIcon name="i-heroicons-folder" class="mx-auto h-12 w-12 text-gray-400" />
						<h3 class="mt-2 text-sm font-medium text-gray-900">No categories</h3>
						<p class="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
						<div class="mt-6">
							<UButton @click="openCreateModal" color="primary">
								<UIcon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
								Add Category
							</UButton>
						</div>
					</div>

					<!-- Categories Table -->
					<div v-else class="overflow-hidden">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Name
									</th>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Slug
									</th>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Created
									</th>
									<th
										class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Actions
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								<tr v-for="category in categories" :key="category.$id" class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-500">{{ category.slug }}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-500">
											{{ formatDate(category.$createdAt) }}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div class="flex justify-end space-x-2">
											<UButton
												@click="openEditModal(category)"
												color="blue"
												variant="ghost"
												size="sm"
												icon="i-heroicons-pencil"
											>
												Edit
											</UButton>
											<UButton
												@click="openDeleteModal(category)"
												color="red"
												variant="ghost"
												size="sm"
												icon="i-heroicons-trash"
											>
												Delete
											</UButton>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- Create/Edit Modal -->
		<UModal v-model="showModal" :prevent-close="isSubmitting">
			<UCard>
				<template #header>
					<h3 class="text-lg font-semibold">
						{{ editingCategory ? 'Edit Category' : 'Create Category' }}
					</h3>
				</template>

				<UForm :schema="categorySchema" :state="formState" class="space-y-4" @submit="handleSubmit">
					<UFormGroup label="Name" name="name" required>
						<UInput
							v-model="formState.name"
							placeholder="Enter category name"
							:disabled="isSubmitting"
							@input="onNameChange"
						/>
					</UFormGroup>

					<UFormGroup label="Slug" name="slug" required>
						<UInput v-model="formState.slug" placeholder="category-slug" :disabled="isSubmitting" />
						<template #help>
							URL-friendly version of the name. Only lowercase letters, numbers, and hyphens allowed.
						</template>
					</UFormGroup>

					<div class="flex justify-end space-x-3 pt-4">
						<UButton @click="closeModal" color="gray" variant="ghost" :disabled="isSubmitting">
							Cancel
						</UButton>
						<UButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
							{{ editingCategory ? 'Update' : 'Create' }}
						</UButton>
					</div>
				</UForm>
			</UCard>
		</UModal>

		<!-- Delete Confirmation Modal -->
		<UModal v-model="showDeleteModal" :prevent-close="isDeleting">
			<UCard>
				<template #header>
					<h3 class="text-lg font-semibold text-red-600">Delete Category</h3>
				</template>

				<div class="space-y-4">
					<p class="text-sm text-gray-600">
						Are you sure you want to delete the category "{{ categoryToDelete?.name }}"? This action cannot
						be undone.
					</p>

					<div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
						<div class="flex">
							<UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-yellow-400" />
							<div class="ml-3">
								<p class="text-sm text-yellow-800">
									<strong>Warning:</strong>
									Products in this category may be affected. Please ensure you handle associated
									products appropriately.
								</p>
							</div>
						</div>
					</div>
				</div>

				<template #footer>
					<div class="flex justify-end space-x-3">
						<UButton @click="closeDeleteModal" color="gray" variant="ghost" :disabled="isDeleting">
							Cancel
						</UButton>
						<UButton @click="confirmDelete" color="red" :loading="isDeleting" :disabled="isDeleting">
							Delete Category
						</UButton>
					</div>
				</template>
			</UCard>
		</UModal>
	</div>
</template>

<script setup lang="ts">
import { z } from 'zod'

// Define page meta for authentication
definePageMeta({
	layout: false,
	middleware: 'auth'
})

// Form validation schema
const categorySchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
	slug: z
		.string()
		.min(1, 'Slug is required')
		.max(100, 'Slug must be 100 characters or less')
		.regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
})

// Use composables
const { logout, isLoading: authLoading } = useAuth()
const {
	categories,
	isLoading,
	error,
	fetchCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	clearError,
	generateSlug
} = useCategories()

// Modal states
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingCategory = ref<any>(null)
const categoryToDelete = ref<any>(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)

// Form state
const formState = reactive({
	name: '',
	slug: ''
})

// Format date helper
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}

// Handle name change to auto-generate slug
const onNameChange = () => {
	if (!editingCategory.value) {
		formState.slug = generateSlug(formState.name)
	}
}

// Open create modal
const openCreateModal = () => {
	editingCategory.value = null
	formState.name = ''
	formState.slug = ''
	showModal.value = true
}

// Open edit modal
const openEditModal = (category: any) => {
	editingCategory.value = category
	formState.name = category.name
	formState.slug = category.slug
	showModal.value = true
}

// Close modal
const closeModal = () => {
	showModal.value = false
	editingCategory.value = null
	formState.name = ''
	formState.slug = ''
}

// Handle form submission
const handleSubmit = async () => {
	isSubmitting.value = true

	try {
		if (editingCategory.value) {
			// Update existing category
			const updated = await updateCategory(editingCategory.value.$id, {
				name: formState.name,
				slug: formState.slug
			})

			if (updated) {
				closeModal()
			}
		} else {
			// Create new category
			const created = await createCategory({
				name: formState.name,
				slug: formState.slug
			})

			if (created) {
				closeModal()
			}
		}
	} finally {
		isSubmitting.value = false
	}
}

// Open delete modal
const openDeleteModal = (category: any) => {
	categoryToDelete.value = category
	showDeleteModal.value = true
}

// Close delete modal
const closeDeleteModal = () => {
	showDeleteModal.value = false
	categoryToDelete.value = null
}

// Confirm delete
const confirmDelete = async () => {
	if (!categoryToDelete.value) return

	isDeleting.value = true

	try {
		const success = await deleteCategory(categoryToDelete.value.$id)
		if (success) {
			closeDeleteModal()
		}
	} finally {
		isDeleting.value = false
	}
}

// Handle logout
const handleLogout = async () => {
	await logout()
	await navigateTo('/admin/login')
}

// Load categories on mount
onMounted(() => {
	fetchCategories()
})

// Set page title
useHead({
	title: 'Category Management - Admin'
})
</script>
