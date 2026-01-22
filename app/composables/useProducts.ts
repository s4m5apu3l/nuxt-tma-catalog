import { databases, storage, appwriteConfig } from '~/utils/appwrite'
import { ID, Query } from 'appwrite'
import { useNetworkRetry } from './useRetry'

interface Product {
	$id: string
	categoryId: string
	title: string
	description: string
	price: number
	images: string[]
	$createdAt: string
	$updatedAt: string
}

interface CreateProductData {
	categoryId: string
	title: string
	description?: string
	price: number
	images?: string[]
}

interface UpdateProductData {
	categoryId?: string
	title?: string
	description?: string
	price?: number
	images?: string[]
}

interface ProductsState {
	products: Product[]
	isLoading: boolean
	error: string | null
	uploadProgress: number
}

export const useProducts = () => {
	// Reactive state
	const state = reactive<ProductsState>({
		products: [],
		isLoading: false,
		error: null,
		uploadProgress: 0
	})

	// Network retry composable
	const { withNetworkRetry } = useNetworkRetry()

	// Clear error state
	const clearError = () => {
		state.error = null
	}

	// Set loading state
	const setLoading = (loading: boolean) => {
		state.isLoading = loading
	}

	// Set error state
	const setError = (error: string) => {
		state.error = error
	}

	// Set upload progress
	const setUploadProgress = (progress: number) => {
		state.uploadProgress = progress
	}

	// Validate product data
	const validateProductData = (data: CreateProductData | UpdateProductData): string | null => {
		if ('title' in data && data.title !== undefined) {
			if (!data.title || data.title.trim().length === 0) {
				return 'Product title is required'
			}
			if (data.title.length > 200) {
				return 'Product title must be 200 characters or less'
			}
		}

		if ('description' in data && data.description !== undefined && data.description !== null) {
			if (data.description.length > 2000) {
				return 'Product description must be 2000 characters or less'
			}
		}

		if ('price' in data && data.price !== undefined) {
			if (typeof data.price !== 'number' || data.price < 0) {
				return 'Product price must be a positive number'
			}
		}

		if ('categoryId' in data && data.categoryId !== undefined) {
			if (!data.categoryId || data.categoryId.trim().length === 0) {
				return 'Category is required'
			}
		}

		return null
	}

	// Validate image file
	const validateImageFile = (file: File): string | null => {
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
		const maxSize = 5 * 1024 * 1024 // 5MB

		if (!allowedTypes.includes(file.type)) {
			return 'Only JPEG, PNG, and WebP images are allowed'
		}

		if (file.size > maxSize) {
			return 'Image size must be less than 5MB'
		}

		return null
	}

	// Upload image to storage
	const uploadImage = async (file: File): Promise<string | null> => {
		try {
			setUploadProgress(0)

			// Validate file
			const validationError = validateImageFile(file)
			if (validationError) {
				setError(validationError)
				return null
			}

			// Generate unique filename
			const fileExtension = file.name.split('.').pop()
			const _fileName = `${ID.unique()}.${fileExtension}`

			// Upload file with progress tracking
			const response = await storage.createFile(
				appwriteConfig.storageBucketId,
				ID.unique(),
				file,
				undefined,
				(progress) => {
					const percentage = Math.round((progress.chunksUploaded / progress.chunksTotal) * 100)
					setUploadProgress(percentage)
				}
			)

			setUploadProgress(100)
			return response.$id
		} catch (error: unknown) {
			console.error('Upload image error:', error)

			const err = error as { code?: number }
			if (err.code === 400) {
				setError('Invalid image file. Please check the file format and size.')
			} else if (err.code === 413) {
				setError('Image file is too large. Maximum size is 5MB.')
			} else {
				setError('Failed to upload image. Please try again.')
			}

			return null
		} finally {
			setUploadProgress(0)
		}
	}

	// Upload multiple images
	const uploadImages = async (files: File[]): Promise<string[]> => {
		const uploadedIds: string[] = []

		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			if (file) {
				const imageId = await uploadImage(file)

				if (imageId) {
					uploadedIds.push(imageId)
				} else {
					// If any upload fails, clean up already uploaded images
					for (const id of uploadedIds) {
						await deleteImage(id)
					}
					return []
				}
			}
		}

		return uploadedIds
	}

	// Delete image from storage
	const deleteImage = async (imageId: string): Promise<boolean> => {
		try {
			await storage.deleteFile(appwriteConfig.storageBucketId, imageId)
			return true
		} catch (error: unknown) {
			console.error('Delete image error:', error)
			return false
		}
	}

	// Get image URL
	const getImageUrl = (imageId: string): string => {
		try {
			const result = storage.getFileView(appwriteConfig.storageBucketId, imageId)
			return result
		} catch (error) {
			console.error('Get image URL error:', error)
			return ''
		}
	}

	// Fetch all products
	const fetchProducts = async (): Promise<void> => {
		try {
			clearError()
			setLoading(true)

			const response = await withNetworkRetry(() =>
				databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.productsCollectionId, [
					Query.orderDesc('$createdAt')
				])
			)

			state.products = response.documents as unknown as Product[]
		} catch (error: unknown) {
			console.error('Fetch products error:', error)
			setError('Failed to load products. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	// Fetch products by category
	const fetchProductsByCategory = async (categoryId: string): Promise<void> => {
		try {
			clearError()
			setLoading(true)

			const response = await withNetworkRetry(() =>
				databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.productsCollectionId, [
					Query.equal('categoryId', categoryId),
					Query.orderDesc('$createdAt')
				])
			)

			state.products = response.documents as unknown as Product[]
		} catch (error: unknown) {
			console.error('Fetch products by category error:', error)
			setError('Failed to load products. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	// Get product by ID
	const getProductById = async (id: string): Promise<Product | null> => {
		try {
			clearError()
			setLoading(true)

			const response = await withNetworkRetry(() =>
				databases.getDocument(appwriteConfig.databaseId, appwriteConfig.productsCollectionId, id)
			)

			return response as unknown as Product
		} catch (error: unknown) {
			console.error('Get product error:', error)
			const err = error as { code?: number }
			if (err.code === 404) {
				setError('Product not found')
			} else {
				setError('Failed to load product. Please try again.')
			}
			return null
		} finally {
			setLoading(false)
		}
	}

	// Create new product
	const createProduct = async (data: CreateProductData): Promise<Product | null> => {
		try {
			clearError()
			setLoading(true)

			// Validate data
			const validationError = validateProductData(data)
			if (validationError) {
				setError(validationError)
				return null
			}

			const productData = {
				categoryId: data.categoryId,
				title: data.title,
				description: data.description || '',
				price: data.price,
				images: data.images || []
			}

			const response = await databases.createDocument(
				appwriteConfig.databaseId,
				appwriteConfig.productsCollectionId,
				ID.unique(),
				productData
			)

			const newProduct = response as unknown as Product

			// Add to local state
			state.products.unshift(newProduct)

			return newProduct
		} catch (error: unknown) {
			console.error('Create product error:', error)

			const err = error as { code?: number }
			if (err.code === 400) {
				setError('Invalid product data. Please check your input.')
			} else {
				setError('Failed to create product. Please try again.')
			}

			return null
		} finally {
			setLoading(false)
		}
	}

	// Create product with image upload
	const createProductWithImages = async (
		data: Omit<CreateProductData, 'images'>,
		imageFiles: File[]
	): Promise<Product | null> => {
		try {
			clearError()
			setLoading(true)

			// Upload images first
			let imageIds: string[] = []
			if (imageFiles.length > 0) {
				imageIds = await uploadImages(imageFiles)
				if (imageIds.length === 0) {
					// Upload failed, error already set
					return null
				}
			}

			// Create product with uploaded image IDs
			const productData = {
				...data,
				images: imageIds
			}

			const product = await createProduct(productData)

			if (!product && imageIds.length > 0) {
				// Product creation failed, clean up uploaded images
				for (const imageId of imageIds) {
					await deleteImage(imageId)
				}
			}

			return product
		} catch (error: unknown) {
			console.error('Create product with images error:', error)
			setError('Failed to create product. Please try again.')
			return null
		} finally {
			setLoading(false)
		}
	}

	// Update product
	const updateProduct = async (id: string, data: UpdateProductData): Promise<Product | null> => {
		try {
			clearError()
			setLoading(true)

			// Validate data
			const validationError = validateProductData(data)
			if (validationError) {
				setError(validationError)
				return null
			}

			const response = await databases.updateDocument(
				appwriteConfig.databaseId,
				appwriteConfig.productsCollectionId,
				id,
				data
			)

			const updatedProduct = response as unknown as Product

			// Update local state
			const index = state.products.findIndex((product) => product.$id === id)
			if (index !== -1) {
				state.products[index] = updatedProduct
			}

			return updatedProduct
		} catch (error: unknown) {
			console.error('Update product error:', error)

			const err = error as { code?: number }
			if (err.code === 404) {
				setError('Product not found')
			} else if (err.code === 400) {
				setError('Invalid product data. Please check your input.')
			} else {
				setError('Failed to update product. Please try again.')
			}

			return null
		} finally {
			setLoading(false)
		}
	}

	// Delete product
	const deleteProduct = async (id: string): Promise<boolean> => {
		try {
			clearError()
			setLoading(true)

			// Get product to access image IDs
			const product = await getProductById(id)
			if (!product) {
				return false
			}

			// Delete product document
			await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.productsCollectionId, id)

			// Delete associated images
			if (product.images && product.images.length > 0) {
				for (const imageId of product.images) {
					await deleteImage(imageId)
				}
			}

			// Remove from local state
			const index = state.products.findIndex((p) => p.$id === id)
			if (index !== -1) {
				state.products.splice(index, 1)
			}

			return true
		} catch (error: unknown) {
			console.error('Delete product error:', error)

			const err = error as { code?: number }
			if (err.code === 404) {
				setError('Product not found')
			} else {
				setError('Failed to delete product. Please try again.')
			}

			return false
		} finally {
			setLoading(false)
		}
	}

	// Add image to existing product
	const addImageToProduct = async (productId: string, imageFile: File): Promise<boolean> => {
		try {
			clearError()
			setLoading(true)

			// Upload image
			const imageId = await uploadImage(imageFile)
			if (!imageId) {
				return false
			}

			// Get current product
			const product = await getProductById(productId)
			if (!product) {
				await deleteImage(imageId)
				return false
			}

			// Update product with new image
			const updatedImages = [...(product.images || []), imageId]
			const updatedProduct = await updateProduct(productId, { images: updatedImages })

			if (!updatedProduct) {
				await deleteImage(imageId)
				return false
			}

			return true
		} catch (error: unknown) {
			console.error('Add image to product error:', error)
			setError('Failed to add image to product. Please try again.')
			return false
		} finally {
			setLoading(false)
		}
	}

	// Remove image from product
	const removeImageFromProduct = async (productId: string, imageId: string): Promise<boolean> => {
		try {
			clearError()
			setLoading(true)

			// Get current product
			const product = await getProductById(productId)
			if (!product) {
				return false
			}

			// Remove image from product
			const updatedImages = (product.images || []).filter((id) => id !== imageId)
			const updatedProduct = await updateProduct(productId, { images: updatedImages })

			if (!updatedProduct) {
				return false
			}

			// Delete image from storage
			await deleteImage(imageId)

			return true
		} catch (error: unknown) {
			console.error('Remove image from product error:', error)
			setError('Failed to remove image from product. Please try again.')
			return false
		} finally {
			setLoading(false)
		}
	}

	return {
		// State (readonly)
		products: readonly(toRef(state, 'products')),
		isLoading: readonly(toRef(state, 'isLoading')),
		error: readonly(toRef(state, 'error')),
		uploadProgress: readonly(toRef(state, 'uploadProgress')),

		// Actions
		fetchProducts,
		fetchProductsByCategory,
		getProductById,
		createProduct,
		createProductWithImages,
		updateProduct,
		deleteProduct,
		clearError,

		// Image management
		uploadImage,
		uploadImages,
		deleteImage,
		getImageUrl,
		addImageToProduct,
		removeImageFromProduct
	}
}
