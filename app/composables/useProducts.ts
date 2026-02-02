import type { Product, CreateProductData, UpdateProductData } from '~/types'
import { Query, ID } from 'appwrite'

const config = useRuntimeConfig()

const databaseId: string = config.public.appwriteBdKey
const collectionId: string = config.public.appwriteCollectionProducts

const products = ref<Product[] | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useProducts = () => {
	const { databases } = useAppwrite()

	const fetchProducts = async (categoryId?: string): Promise<void> => {
		loading.value = true
		error.value = null

		try {
			const queries = [Query.equal('isActive', true), Query.orderAsc('sortOrder'), Query.orderDesc('$createdAt')]

			if (categoryId) {
				queries.unshift(Query.equal('categoryId', categoryId))
			}

			const response = await databases.listDocuments(databaseId, collectionId, queries)

			products.value = response.documents as unknown as Product[]
		} catch (err) {
			console.error('Error fetching products:', err)
			error.value = 'Failed to fetch products'
		} finally {
			loading.value = false
		}
	}

	const createProduct = async (data: CreateProductData): Promise<Product | null> => {
		loading.value = true
		error.value = null

		try {
			const response = await databases.createDocument(databaseId, collectionId, ID.unique(), {
				...data,
				images: data.images ?? [],
				features: data.features ?? { en: [], ru: [] },
				isAvailable: data.isAvailable ?? true,
				isActive: data.isActive ?? true,
				sortOrder: data.sortOrder ?? 0,
				contactMessage: data.contactMessage ?? { en: '', ru: '' }
			})

			const newProduct = response as unknown as Product
			if (products.value) {
				products.value.push(newProduct)
				// Re-sort products
				products.value.sort((a, b) => a.sortOrder - b.sortOrder)
			}

			return newProduct
		} catch (err) {
			console.error('Error creating product:', err)
			error.value = 'Failed to create product'
			return null
		} finally {
			loading.value = false
		}
	}

	const updateProduct = async (data: UpdateProductData): Promise<Product | null> => {
		loading.value = true
		error.value = null

		try {
			const { $id, ...updateData } = data
			const response = await databases.updateDocument(databaseId, collectionId, $id, updateData)

			const updatedProduct = response as unknown as Product
			if (products.value) {
				const index = products.value.findIndex((prod) => prod.$id === $id)
				if (index !== -1) {
					products.value[index] = updatedProduct
				}
			}

			return updatedProduct
		} catch (err) {
			console.error('Error updating product:', err)
			error.value = 'Failed to update product'
			return null
		} finally {
			loading.value = false
		}
	}

	const deleteProduct = async (productId: string): Promise<boolean> => {
		loading.value = true
		error.value = null

		try {
			await databases.deleteDocument(databaseId, collectionId, productId)

			if (products.value) {
				products.value = products.value.filter((prod) => prod.$id !== productId)
			}

			return true
		} catch (err) {
			console.error('Error deleting product:', err)
			error.value = 'Failed to delete product'
			return false
		} finally {
			loading.value = false
		}
	}

	const getProductBySlug = (slug: string): Product | undefined => {
		return products.value?.find((prod) => prod.slug === slug)
	}

	const getProductById = (id: string): Product | undefined => {
		return products.value?.find((prod) => prod.$id === id)
	}

	const getProductsByCategory = (categoryId: string): Product[] => {
		return products.value?.filter((prod) => prod.categoryId === categoryId) ?? []
	}

	const getAvailableProducts = (): Product[] => {
		return products.value?.filter((prod) => prod.isAvailable && prod.isActive) ?? []
	}

	return {
		products,
		loading,
		error,
		fetchProducts,
		createProduct,
		updateProduct,
		deleteProduct,
		getProductBySlug,
		getProductById,
		getProductsByCategory,
		getAvailableProducts
	}
}
