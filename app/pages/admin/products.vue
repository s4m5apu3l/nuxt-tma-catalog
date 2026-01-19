<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="border-b border-gray-200 pb-5">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold leading-7 tt-3xl">
						{{ $t('admin.products.title') }}
					</h1>
				</div>
				<div class="flex items-center space-x-3">
					<UButton

						icon="i-lucide-plus"
					>
						{{ $t('a }}
					</UButton>
				</div>
			</div>
		</div>

		<!-- 
		<div v-if=">
			<Icon name="i" />
		</div>

		<!-- Er
		<div v
>
				<Icon name="i-lucidrt-cie-ale
		<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			<div class="px-4 py-6 sm:px-0">
				<!-- Error Alert -->
				<div v-if="error" class="mb-6">
					<UAlert
						color="error"
						variant="soft"
						:title="error"
						:close-button="{
							icon: 'i-heroicons-x-mark-20-solid',
							color: 'neutral',
							variant: 'link',
							padded: false
						}"
						@close="clearError"
					/>
				</div>

				<!-- Products List -->
				<div class="bg-white shadow rounded-lg">
					<div class="px-6 py-4 border-b border-gray-200">
						<h3 class="text-lg font-medium text-gray-900">Products</h3>
					</div>

					<!-- Loading State -->
					<div v-if="isLoading && products.length === 0" class="p-6">
						<div class="animate-pulse space-y-4">
							<div v-for="i in 3" :key="i" class="h-20 bg-gray-200 rounded"></div>
						</div>
					</div>

					<!-- Empty State -->
					<div v-else-if="!isLoading && products.length === 0" class="p-6 text-center">
						<UIcon name="i-heroicons-cube" class="mx-auto h-12 w-12 text-gray-400" />
						<h3 class="mt-2 text-sm font-medium text-gray-900">No products</h3>
						<p class="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
						<div class="mt-6">
							<UButton @click="openCreateModal" color="primary">
								<UIcon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
								Add Product
							</UButton>
						</div>
					</div>

					<!-- Products Table -->
					<div v-else class="overflow-hidden">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Product
									</th>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Category
									</th>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Price
									</th>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Images
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
								<tr v-for="product in products" :key="product.$id" class="hover:bg-gray-50">
									<td class="px-6 py-4">
										<div class="flex items-center">
											<div class="flex-shrink-0 h-12 w-12">
												<img
													v-if="product.images && product.images.length > 0"
													:src="getImageUrl(product.images[0])"
													:alt="product.title"
													class="h-12 w-12 rounded-lg object-cover"
												/>
												<div
													v-else
													class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center"
												>
													<UIcon name="i-heroicons-photo" class="h-6 w-6 text-gray-400" />
												</div>
											</div>
											<div class="ml-4">
												<div class="text-sm font-medium text-gray-900">{{ product.title }}</div>
												<div class="text-sm text-gray-500 truncate max-w-xs">
													{{ product.description }}
												</div>
											</div>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-900">
											{{ getCategoryName(product.categoryId) }}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-gray-900">${{ product.price }}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-500">
											{{ product.images?.length || 0 }} image(s)
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-500">
											{{ formatDate(product.$createdAt) }}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div class="flex justify-end space-x-2">
											<UButton
												@click="openEditModal(product)"
												color="primary"
												variant="ghost"
												size="sm"
												icon="i-heroicons-pencil"
											>
												Edit
											</UButton>
											<UButton
												@click="openDeleteModal(product)"
												color="error"
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
						{{ editingProduct ? 'Edit Product' : 'Create Product' }}
					</h3>
				</template>

				<UForm :state="formState" class="space-y-4" @submit="handleSubmit">
					<UFormGroup label="Title" name="title" required>
						<UInput
							v-model="formState.title"
							placeholder="Enter product title"
							:disabled="isSubmitting"
						/>
					</UFormGroup>

					<UFormGroup label="Category" name="categoryId" required>
						<USelect
							v-model="formState.categoryId"
							:options="categoryOptions"
							placeholder="Select a category"
							:disabled="isSubmitting"
						/>
					</UFormGroup>

					<UFormGroup label="Price" name="price" required>
						<UInput
							v-model.number="formState.price"
							type="number"
							step="0.01"
							min="0"
							placeholder="0.00"
							:disabled="isSubmitting"
						/>
					</UFormGroup>

					<UFormGroup label="Description" name="description">
						<UTextarea
							v-model="formState.description"
							placeholder="Enter product description"
							:rows="4"
							:disabled="isSubmitting"
						/>
					</UFormGroup>

					<!-- Image Upload Section -->
					<UFormGroup label="Images" name="images">
						<!-- Existing Images (Edit Mode) -->
						<div v-if="editingProduct && formState.existingImages.length > 0" class="mb-4">
							<p class="text-sm text-gray-600 mb-2">Current Images:</p>
							<div class="grid grid-cols-3 gap-2">
								<div
									v-for="(imageId, index) in formState.existingImages"
									:key="imageId"
									class="relative group"
								>
									<img
										:src="getImageUrl(imageId)"
										:alt="`Product image ${index + 1}`"
										class="w-full h-20 object-cover rounded-lg"
									/>
									<button
										type="button"
										@click="removeExistingImage(imageId)"
										class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
										:disabled="isSubmitting"
									>
										<UIcon name="i-heroicons-x-mark" class="h-3 w-3" />
									</button>
								</div>
							</div>
						</div>

						<!-- New Images Preview -->
						<div v-if="formState.newImages.length > 0" class="mb-4">
							<p class="text-sm text-gray-600 mb-2">New Images:</p>
							<div class="grid grid-cols-3 gap-2">
								<div
									v-for="(file, index) in formState.newImages"
									:key="index"
									class="relative group"
								>
									<img
										:src="getFilePreview(file)"
										:alt="`New image ${index + 1}`"
										class="w-full h-20 object-cover rounded-lg"
									/>
									<button
										type="button"
										@click="removeNewImage(index)"
										class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
										:disabled="isSubmitting"
									>
										<UIcon name="i-heroicons-x-mark" class="h-3 w-3" />
									</button>
								</div>
							</div>
						</div>

						<!-- Drag and Drop Upload Area -->
						<div
							@drop="handleDrop"
							@dragover.prevent
							@dragenter.prevent
							:class="[
								'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
								isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300',
								isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
							]"
							@click="triggerFileInput"
						>
							<input
								ref="fileInput"
								type="file"
								multiple
								accept="image/*"
								class="hidden"
								@change="handleFileSelect"
								:disabled="isSubmitting"
							/>
							<UIcon name="i-heroicons-cloud-arrow-up" class="mx-auto h-12 w-12 text-gray-400" />
							<p class="mt-2 text-sm text-gray-600">
								<span class="font-medium">Click to upload</span> or drag and drop
							</p>
							<p class="text-xs text-gray-500">PNG, JPG, WebP up to 5MB each</p>
						</div>

						<!-- Upload Progress -->
						<div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-2">
							<div class="flex justify-between text-sm text-gray-600 mb-1">
								<span>Uploading...</span>
								<span>{{ uploadProgress }}%</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div
									class="bg-blue-600 h-2 rounded-full transition-all duration-300"
									:style="{ width: `${uploadProgress}%` }"
								></div>
							</div>
						</div>
					</UFormGroup>

					<div class="flex justify-end space-x-3 pt-4">
						<UButton @click="closeModal" color="neutral" variant="ghost" :disabled="isSubmitting">
							Cancel
						</UButton>
						<UButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
							{{ editingProduct ? 'Update' : 'Create' }}
						</UButton>
					</div>
				</UForm>
			</UCard>
		</UModal>

		<!-- Delete Confirmation Modal -->
		<UModal v-model="showDeleteModal" :prevent-close="isDeleting">
			<UCard>
				<template #header>
					<h3 class="text-lg font-semibold text-red-600">Delete Product</h3>
				</template>

				<div class="space-y-4">
					<p class="text-sm text-gray-600">
						Are you sure you want to delete the product "{{ productToDelete?.title }}"? This action cannot
						be undone.
					</p>

					<div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
						<div class="flex">
							<UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-yellow-400" />
							<div class="ml-3">
								<p class="text-sm text-yellow-800">
									<strong>Warning:</strong>
									All associated images will also be permanently deleted.
								</p>
							</div>
						</div>
					</div>
				</div>

				<template #footer>
					<div class="flex justify-end space-x-3">
						<UButton @click="closeDeleteModal" color="neutral" variant="ghost" :disabled="isDeleting">
							Cancel
						</UButton>
						<UButton @click="confirmDelete" color="error" :loading="isDeleting" :disabled="isDeleting">
							Delete Product
						</UButton>
					</div>
				</template>
			</UCard>
		</UModal>
	</div>
</template>

<script setup lang="ts">
// Define page meta for authentication
definePageMeta({
	layout: false,
	middleware: 'auth'
})

// Use composables
const { logout, isLoading: authLoading } = useAuth()
const {
	products,
	isLoading,
	error,
	uploadProgress,
	fetchProducts,
	createProductWithImages,
	updateProduct,
	deleteProduct,
	clearError,
	getImageUrl,
	removeImageFromProduct,
	uploadImages
} = useProducts()

const { categories, fetchCategories } = useCategories()

// Modal states
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref<any>(null)
const productToDelete = ref<any>(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const isDragOver = ref(false)

// File input ref
const fileInput = ref<HTMLInputElement>()

// Form state
const formState = reactive({
	title: '',
	categoryId: '',
	description: '',
	price: 0,
	newImages: [] as File[],
	existingImages: [] as string[]
})

// Computed properties
const categoryOptions = computed(() => {
	return categories.value.map(category => ({
		label: category.name,
		value: category.$id
	}))
})

// Format date helper
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}

// Get category name by ID
const getCategoryName = (categoryId: string) => {
	const category = categories.value.find(cat => cat.$id === categoryId)
	return category?.name || 'Unknown'
}

// Get file preview URL
const getFilePreview = (file: File) => {
	return URL.createObjectURL(file)
}

// Handle drag over
const handleDragOver = (event: DragEvent) => {
	event.preventDefault()
	isDragOver.value = true
}

// Handle drag leave
const handleDragLeave = () => {
	isDragOver.value = false
}

// Handle drop
const handleDrop = (event: DragEvent) => {
	event.preventDefault()
	isDragOver.value = false
	
	if (isSubmitting.value) return
	
	const files = Array.from(event.dataTransfer?.files || [])
	const imageFiles = files.filter(file => file.type.startsWith('image/'))
	
	if (imageFiles.length > 0) {
		formState.newImages.push(...imageFiles)
	}
}

// Trigger file input
const triggerFileInput = () => {
	if (isSubmitting.value) return
	fileInput.value?.click()
}

// Handle file select
const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement
	const files = Array.from(target.files || [])
	
	if (files.length > 0) {
		formState.newImages.push(...files)
	}
	
	// Reset input
	target.value = ''
}

// Remove new image
const removeNewImage = (index: number) => {
	formState.newImages.splice(index, 1)
}

// Remove existing image
const removeExistingImage = async (imageId: string) => {
	if (!editingProduct.value) return
	
	try {
		const success = await removeImageFromProduct(editingProduct.value.$id, imageId)
		if (success) {
			const index = formState.existingImages.indexOf(imageId)
			if (index > -1) {
				formState.existingImages.splice(index, 1)
			}
		}
	} catch (error) {
		console.error('Failed to remove image:', error)
	}
}

// Open create modal
const openCreateModal = () => {
	editingProduct.value = null
	resetForm()
	showModal.value = true
}

// Open edit modal
const openEditModal = (product: any) => {
	editingProduct.value = product
	formState.title = product.title
	formState.categoryId = product.categoryId
	formState.description = product.description || ''
	formState.price = product.price
	formState.newImages = []
	formState.existingImages = [...(product.images || [])]
	showModal.value = true
}

// Close modal
const closeModal = () => {
	showModal.value = false
	editingProduct.value = null
	resetForm()
}

// Reset form
const resetForm = () => {
	formState.title = ''
	formState.categoryId = ''
	formState.description = ''
	formState.price = 0
	formState.newImages = []
	formState.existingImages = []
}

// Handle form submission
const handleSubmit = async () => {
	isSubmitting.value = true

	try {
		if (editingProduct.value) {
			// Update existing product
			const updateData: any = {
				title: formState.title,
				categoryId: formState.categoryId,
				description: formState.description,
				price: formState.price
			}

			// If there are new images, upload them first
			if (formState.newImages.length > 0) {
				const newImageIds = await uploadImages(formState.newImages)
				
				if (newImageIds.length > 0) {
					updateData.images = [...formState.existingImages, ...newImageIds]
				} else {
					updateData.images = formState.existingImages
				}
			} else {
				updateData.images = formState.existingImages
			}

			const updated = await updateProduct(editingProduct.value.$id, updateData)

			if (updated) {
				closeModal()
			}
		} else {
			// Create new product
			const productData = {
				categoryId: formState.categoryId,
				title: formState.title,
				description: formState.description,
				price: formState.price
			}

			const created = await createProductWithImages(productData, formState.newImages)

			if (created) {
				closeModal()
			}
		}
	} finally {
		isSubmitting.value = false
	}
}

// Open delete modal
const openDeleteModal = (product: any) => {
	productToDelete.value = product
	showDeleteModal.value = true
}

// Close delete modal
const closeDeleteModal = () => {
	showDeleteModal.value = false
	productToDelete.value = null
}

// Confirm delete
const confirmDelete = async () => {
	if (!productToDelete.value) return

	isDeleting.value = true

	try {
		const success = await deleteProduct(productToDelete.value.$id)
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

// Load data on mount
onMounted(async () => {
	await Promise.all([
		fetchProducts(),
		fetchCategories()
	])
})

// Set page title
useHead({
	title: 'Product Management - Admin'
})
</script>