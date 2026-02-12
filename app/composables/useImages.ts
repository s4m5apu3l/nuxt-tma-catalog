import { ID } from 'appwrite'
import { validateImageFile } from '~/utils/images'
import { compressImage, getCompressionStats } from '~/utils/imageCompression'

export const useImages = () => {
	const { storage } = useAppwrite()
	const config = useRuntimeConfig()

	const isUploading = ref(false)
	const uploadProgress = ref(0)
	const error = ref<string | null>(null)
	const compressionEnabled = ref(true)

	/**
	 * Upload image to Appwrite storage with optional compression
	 */
	const uploadImage = async (file: File, compress = true): Promise<string> => {
		const validation = validateImageFile(file)
		if (!validation.isValid) {
			throw new Error(validation.error)
		}

		isUploading.value = true
		error.value = null
		uploadProgress.value = 0

		try {
			let fileToUpload = file

			// Compress image if enabled
			if (compress && compressionEnabled.value) {
				uploadProgress.value = 10
				fileToUpload = await compressImage(file, {
					maxWidth: 1920,
					maxHeight: 1920,
					quality: 0.85,
					mimeType: 'image/webp'
				})

				// Log compression stats in development
				if (process.dev) {
					const stats = getCompressionStats(file.size, fileToUpload.size)
					console.log('Image compressed:', stats)
				}

				uploadProgress.value = 30
			}

			const fileId = ID.unique()
			const bucketId = config.public.appwriteBucketId

			if (!bucketId) {
				throw new Error('Storage bucket ID is not configured')
			}

			const response = await storage.createFile(bucketId, fileId, fileToUpload)

			uploadProgress.value = 100
			return response.$id
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
			error.value = errorMessage
			throw new Error(errorMessage)
		} finally {
			isUploading.value = false
		}
	}

	/**
	 * Upload multiple images with compression
	 */
	const uploadImages = async (files: File[], compress = true): Promise<string[]> => {
		const uploadPromises = files.map((file) => uploadImage(file, compress))
		return Promise.all(uploadPromises)
	}

	/**
	 * Delete image from storage
	 */
	const deleteImage = async (fileId: string): Promise<void> => {
		try {
			const bucketId = config.public.appwriteBucketId

			if (!bucketId) {
				throw new Error('Storage bucket ID is not configured')
			}

			await storage.deleteFile(bucketId, fileId)
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to delete image'
			error.value = errorMessage
			throw new Error(errorMessage)
		}
	}

	/**
	 * Get image file info
	 */
	const getImageInfo = async (fileId: string) => {
		try {
			const bucketId = config.public.appwriteBucketId

			if (!bucketId) {
				throw new Error('Storage bucket ID is not configured')
			}

			return await storage.getFile(bucketId, fileId)
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to get image info'
			error.value = errorMessage
			throw new Error(errorMessage)
		}
	}

	return {
		// State
		isUploading: readonly(isUploading),
		uploadProgress: readonly(uploadProgress),
		error: readonly(error),
		compressionEnabled,

		// Methods
		uploadImage,
		uploadImages,
		deleteImage,
		getImageInfo
	} as const
}
