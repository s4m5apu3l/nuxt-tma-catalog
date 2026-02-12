<script setup lang="ts">
import { getImageUrl } from '~/utils/images'

interface Props {
	modelValue: string[]
	maxImages?: number
	disabled?: boolean
}

interface Emits {
	'update:modelValue': [images: string[]]
}

const props = withDefaults(defineProps<Props>(), {
	maxImages: 5,
	disabled: false
})

const emit = defineEmits<Emits>()

const { uploadImage, deleteImage, isUploading, error } = useImages()
const { t } = useI18n()

const fileInput = ref<HTMLInputElement>()
const dragOver = ref(false)

const canAddMore = computed(() => {
	return props.modelValue.length < props.maxImages
})

const handleFileSelect = async (files: FileList | null): Promise<void> => {
	if (!files || files.length === 0) return

	const remainingSlots = props.maxImages - props.modelValue.length
	const filesToUpload = Array.from(files).slice(0, remainingSlots)

	try {
		for (const file of filesToUpload) {
			const fileId = await uploadImage(file)
			emit('update:modelValue', [...props.modelValue, fileId])
		}
	} catch (err) {
		console.error('Failed to upload images:', err)
	}
}

const handleFileInputChange = (event: Event): void => {
	const target = event.target as HTMLInputElement
	handleFileSelect(target.files)
	if (target) target.value = ''
}

const handleDrop = (event: DragEvent): void => {
	event.preventDefault()
	dragOver.value = false

	if (props.disabled) return

	handleFileSelect(event.dataTransfer?.files || null)
}

const handleDragOver = (event: DragEvent): void => {
	event.preventDefault()
	dragOver.value = true
}

const handleDragLeave = (): void => {
	dragOver.value = false
}

const removeImage = async (index: number): Promise<void> => {
	const imageId = props.modelValue[index]

	if (!imageId) return

	try {
		await deleteImage(imageId)
		const newImages = [...props.modelValue]
		newImages.splice(index, 1)
		emit('update:modelValue', newImages)
	} catch (err) {
		console.error('Failed to delete image:', err)
	}
}

const openFileDialog = (): void => {
	if (props.disabled || !canAddMore.value) return
	fileInput.value?.click()
}
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				{{ t('admin.images') }}
			</label>
			<span class="text-xs text-gray-500">{{ modelValue.length }} / {{ maxImages }}</span>
		</div>

		<div v-if="modelValue.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<div
				v-for="(imageId, index) in modelValue"
				:key="imageId"
				class="relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
			>
				<img :src="getImageUrl(imageId)" :alt="`Image ${index + 1}`" class="w-full h-full object-cover" />

				<div class="absolute inset-0 flex items-center justify-center">
					<UButton
						color="error"
						variant="solid"
						size="sm"
						icon="i-lucide-trash-2"
						:disabled="disabled"
						@click="removeImage(index)"
					>
						{{ t('common.delete') }}
					</UButton>
				</div>
			</div>
		</div>

		<div
			v-if="canAddMore"
			class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer transition-colors duration-200"
			:class="{
				'border-primary-500 bg-primary-50 dark:bg-primary-900/20': dragOver,
				'hover:border-gray-400 dark:hover:border-gray-500': !disabled && !dragOver,
				'opacity-50 cursor-not-allowed': disabled
			}"
			@click="openFileDialog"
			@drop="handleDrop"
			@dragover="handleDragOver"
			@dragleave="handleDragLeave"
		>
			<input
				ref="fileInput"
				type="file"
				multiple
				accept="image/jpeg,image/png,image/webp"
				class="hidden"
				:disabled="disabled"
				@change="handleFileInputChange"
			/>

			<div class="space-y-2">
				<UIcon
					name="i-lucide-upload"
					class="mx-auto text-4xl text-gray-400"
					:class="{ 'animate-pulse': isUploading }"
				/>

				<div class="text-sm text-gray-600 dark:text-gray-400">
					<p class="font-medium">
						{{ isUploading ? t('admin.uploading') : t('admin.clickToUpload') }}
					</p>
					<p>{{ t('admin.dragAndDrop') }}</p>
					<p class="text-xs mt-1">{{ t('admin.imageFormats') }} ({{ t('admin.maxSize') }}: 5MB)</p>
				</div>
			</div>
		</div>

		<div v-if="error" class="text-sm text-red-600 dark:text-red-400">
			{{ error }}
		</div>
	</div>
</template>
