/**
 * Get image URL from Appwrite storage
 */
export const getImageUrl = (fileId: string): string => {
	if (!fileId) return ''

	const config = useRuntimeConfig()
	const bucketId = config.public.appwriteBucketId

	if (!bucketId) {
		console.warn('Appwrite bucket ID is not configured')
		return ''
	}

	return `${config.public.appwriteEndpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${config.public.appwriteProjectId}`
}

/**
 * Get image preview URL (fallback to direct view when transformations are not available)
 * Note: This returns the same URL as getImageUrl since transformations require a paid plan
 */
export const getImagePreviewUrl = (fileId: string, _width?: number, _height?: number, _quality?: number): string => {
	// For free plans, we can't use transformations, so return direct view URL
	return getImageUrl(fileId)
}

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
	const maxSize = 5 * 1024 * 1024 // 5MB
	const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

	if (!allowedTypes.includes(file.type)) {
		return {
			isValid: false,
			error: 'Only JPG, PNG, and WebP images are allowed'
		}
	}

	if (file.size > maxSize) {
		return {
			isValid: false,
			error: 'Image size must be less than 5MB'
		}
	}

	return { isValid: true }
}
