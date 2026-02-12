/**
 * Image compression utilities for optimizing uploads
 */

interface CompressionOptions {
	maxWidth?: number
	maxHeight?: number
	quality?: number
	mimeType?: string
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
	maxWidth: 1920,
	maxHeight: 1920,
	quality: 0.85,
	mimeType: 'image/webp'
}

/**
 * Compress image file before upload
 */
export const compressImage = async (file: File, options: CompressionOptions = {}): Promise<File> => {
	const opts = { ...DEFAULT_OPTIONS, ...options }

	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = (e) => {
			const img = new Image()

			img.onload = () => {
				try {
					const canvas = document.createElement('canvas')
					let { width, height } = img

					// Calculate new dimensions while maintaining aspect ratio
					if (width > opts.maxWidth || height > opts.maxHeight) {
						const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height)
						width = Math.round(width * ratio)
						height = Math.round(height * ratio)
					}

					canvas.width = width
					canvas.height = height

					const ctx = canvas.getContext('2d')
					if (!ctx) {
						reject(new Error('Failed to get canvas context'))
						return
					}

					// Draw image with high quality
					ctx.imageSmoothingEnabled = true
					ctx.imageSmoothingQuality = 'high'
					ctx.drawImage(img, 0, 0, width, height)

					// Convert to blob
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								reject(new Error('Failed to compress image'))
								return
							}

							// Create new file from blob
							const compressedFile = new File([blob], file.name, {
								type: opts.mimeType,
								lastModified: Date.now()
							})

							resolve(compressedFile)
						},
						opts.mimeType,
						opts.quality
					)
				} catch (error) {
					reject(error)
				}
			}

			img.onerror = () => {
				reject(new Error('Failed to load image'))
			}

			img.src = e.target?.result as string
		}

		reader.onerror = () => {
			reject(new Error('Failed to read file'))
		}

		reader.readAsDataURL(file)
	})
}

/**
 * Get compression stats for display
 */
export const getCompressionStats = (originalSize: number, compressedSize: number) => {
	const savedBytes = originalSize - compressedSize
	const savedPercent = Math.round((savedBytes / originalSize) * 100)

	return {
		originalSize,
		compressedSize,
		savedBytes,
		savedPercent,
		originalSizeMB: (originalSize / 1024 / 1024).toFixed(2),
		compressedSizeMB: (compressedSize / 1024 / 1024).toFixed(2)
	}
}
