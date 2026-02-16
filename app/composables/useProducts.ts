import { Query, ID } from 'appwrite'
import type { Product, CreateProductData, UpdateProductData } from '~/types'

const parseProduct = (doc: any): Product => {
	return {
		...doc,
		name: typeof doc.name === 'string' ? JSON.parse(doc.name) : doc.name,
		description: typeof doc.description === 'string' ? JSON.parse(doc.description) : doc.description,
		features: typeof doc.features === 'string' ? JSON.parse(doc.features) : doc.features,
		contactMessage: typeof doc.contactMessage === 'string' ? JSON.parse(doc.contactMessage) : doc.contactMessage,
		pricing: typeof doc.pricing === 'string' ? JSON.parse(doc.pricing) : doc.pricing || []
	} as Product
}

// Глобальное состояние для кеширования
const globalProducts = ref<Product[]>([])
const globalLoading = ref(false)
const globalError = ref<string | null>(null)
const lastFetchTime = ref<number>(0)
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

export const useProducts = () => {
	const product = ref<Product | null>(null)

	const { databases } = useAppwrite()
	const { handleError } = useErrorHandler()
	const config = useRuntimeConfig()

	const databaseId: string = config.public.appwriteBdKey
	const collectionId: string = config.public.appwriteCollectionProducts

	const isCacheValid = (): boolean => {
		return Date.now() - lastFetchTime.value < CACHE_DURATION && globalProducts.value.length > 0
	}

	const fetchProducts = async (categoryId?: string, forceRefresh = false): Promise<Product[]> => {
		// Используем кеш если он валиден и нет фильтра по категории
		if (!forceRefresh && !categoryId && isCacheValid()) {
			return globalProducts.value
		}

		globalLoading.value = true
		globalError.value = null

		try {
			const queries = [Query.equal('isActive', true), Query.orderDesc('$createdAt')]
			if (categoryId) {
				queries.push(Query.equal('categoryId', categoryId))
			}

			const response = await databases.listDocuments(databaseId, collectionId, queries)

			const fetchedProducts = response.documents.map(parseProduct)

			// Обновляем глобальный кеш только если загружаем все продукты
			if (!categoryId) {
				globalProducts.value = fetchedProducts
				lastFetchTime.value = Date.now()
			}

			return fetchedProducts
		} catch (err) {
			globalError.value = err instanceof Error ? err.message : 'Unknown error'
			throw err
		} finally {
			globalLoading.value = false
		}
	}

	const fetchProduct = async (productId: string): Promise<Product> => {
		globalLoading.value = true
		globalError.value = null

		try {
			const response = await databases.getDocument(databaseId, collectionId, productId)
			product.value = parseProduct(response)
			return product.value
		} catch (err) {
			globalError.value = err instanceof Error ? err.message : 'Unknown error'
			throw err
		} finally {
			globalLoading.value = false
		}
	}

	const fetchAllProducts = async (): Promise<Product[]> => {
		return fetchProducts(undefined, true)
	}

	const createProduct = async (data: CreateProductData): Promise<Product | null> => {
		globalLoading.value = true
		globalError.value = null

		try {
			const response = await databases.createDocument(databaseId, collectionId, ID.unique(), {
				...data,
				name: JSON.stringify(data.name),
				description: JSON.stringify(data.description),
				features: JSON.stringify(data.features || []),
				contactMessage: JSON.stringify(data.contactMessage || {}),
				pricing: JSON.stringify(data.pricing || []),
				isActive: data.isActive ?? true
			})

			const newProduct = parseProduct(response)
			globalProducts.value.unshift(newProduct)

			return newProduct
		} catch (err: any) {
			console.error('Error creating product:', err)
			globalError.value = 'Failed to create product'
			handleError(err, 'Ошибка создания товара')
			return null
		} finally {
			globalLoading.value = false
		}
	}

	const updateProduct = async (productId: string, data: UpdateProductData): Promise<Product | null> => {
		globalLoading.value = true
		globalError.value = null

		try {
			const response = await databases.updateDocument(databaseId, collectionId, productId, {
				...data,
				name: data.name ? JSON.stringify(data.name) : undefined,
				description: data.description ? JSON.stringify(data.description) : undefined,
				features: data.features ? JSON.stringify(data.features) : undefined,
				contactMessage: data.contactMessage ? JSON.stringify(data.contactMessage) : undefined,
				pricing: data.pricing ? JSON.stringify(data.pricing) : undefined
			})

			const updatedProduct = parseProduct(response)
			const index = globalProducts.value.findIndex((prod) => prod.$id === productId)
			if (index !== -1) {
				globalProducts.value[index] = updatedProduct
			}

			return updatedProduct
		} catch (err: any) {
			console.error('Error updating product:', err)
			globalError.value = 'Failed to update product'
			handleError(err, 'Ошибка обновления товара')
			return null
		} finally {
			globalLoading.value = false
		}
	}

	const deleteProduct = async (productId: string): Promise<boolean> => {
		globalLoading.value = true
		globalError.value = null

		try {
			await databases.deleteDocument(databaseId, collectionId, productId)
			globalProducts.value = globalProducts.value.filter((prod) => prod.$id !== productId)

			return true
		} catch (err: any) {
			console.error('Error deleting product:', err)
			globalError.value = 'Failed to delete product'
			handleError(err, 'Ошибка удаления товара')
			return false
		} finally {
			globalLoading.value = false
		}
	}

	const getProductBySlug = (slug: string): Product | undefined => {
		return globalProducts.value.find((product) => product.slug === slug)
	}

	const getProductById = (id: string): Product | undefined => {
		return globalProducts.value.find((prod) => prod.$id === id)
	}

	return {
		products: readonly(globalProducts),
		product: readonly(product),
		isLoading: readonly(globalLoading),
		loading: readonly(globalLoading),
		error: readonly(globalError),
		fetchProducts,
		fetchProduct,
		fetchAllProducts,
		createProduct,
		updateProduct,
		deleteProduct,
		getProductBySlug,
		getProductById
	} as const
}
