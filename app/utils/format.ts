export const formatPrice = (price: number, unit: string): string => {
	return `${price.toLocaleString()} ${unit}`
}

export const getImageUrl = (imageId: string): string => {
	const config = useRuntimeConfig()
	const { storage } = useAppwrite()

	if (!imageId) return ''

	try {
		return storage.getFilePreview(config.public.appwriteBucketId, imageId, 800, 600)
	} catch {
		return ''
	}
}

export const getThumbnailUrl = (imageId: string): string => {
	const config = useRuntimeConfig()
	const { storage } = useAppwrite()

	if (!imageId) return ''

	try {
		return storage.getFilePreview(config.public.appwriteBucketId, imageId, 400, 300)
	} catch {
		return ''
	}
}
