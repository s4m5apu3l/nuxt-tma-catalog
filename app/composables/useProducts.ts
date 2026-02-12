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

export const useProducts = () => {
	const products = ref<Product[]>([])
	const product = ref<Product | null>(null)
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	const { databases } = useAppwrite()
	const { handleError, handleSuccess } = useErrorHandler()
	const config = useRuntimeConfig()

	const databaseId: string = config.public.appwriteBdKey
	const collectionId: string = config.public.appwriteCollectionProducts

	const fetchProducts = async (categoryId?: string): Promise<Product[]> => {
		isLoading.value = true
		error.value = null

		try {
			const queries = [Query.equal('isActive', true)]
			if (categoryId) {
				queries.push(Query.equal('categoryId', categoryId))
			}

			const response = await databases.listDocuments(databaseId, collectionId, queries)

			products.value = response.documents.map(parseProduct)
			return products.value
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error'
			throw err
		} finally {
			isLoading.value = false
		}
	}

	const fetchProduct = async (productId: string): Promise<Product> => {
		isLoading.value = true
		error.value = null

		try {
			const response = await databases.getDocument(databaseId, collectionId, productId)
			product.value = parseProduct(response)
			return product.value
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error'
			throw err
		} finally {
			isLoading.value = false
		}
	}

	const fetchAllProducts = async (): Promise<Product[]> => {
		isLoading.value = true
		error.value = null

		try {
			const response = await databases.listDocuments(databaseId, collectionId)

			products.value = response.documents.map(parseProduct)
			return products.value
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error'
			throw err
		} finally {
			isLoading.value = false
		}
	}

	const createProduct = async (data: CreateProductData): Promise<Product | null> => {
		isLoading.value = true
		error.value = null

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
			products.value.push(newProduct)

			handleSuccess('Товар успешно создан')
			return newProduct
		} catch (err: any) {
			console.error('Error creating product:', err)
			error.value = 'Failed to create product'
			handleError(err, 'Ошибка создания товара')
			return null
		} finally {
			isLoading.value = false
		}
	}

	const updateProduct = async (productId: string, data: UpdateProductData): Promise<Product | null> => {
		isLoading.value = true
		error.value = null

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
			const index = products.value.findIndex((prod) => prod.$id === productId)
			if (index !== -1) {
				products.value[index] = updatedProduct
			}

			handleSuccess('Товар успешно обновлен')
			return updatedProduct
		} catch (err: any) {
			console.error('Error updating product:', err)
			error.value = 'Failed to update product'
			handleError(err, 'Ошибка обновления товара')
			return null
		} finally {
			isLoading.value = false
		}
	}

	const deleteProduct = async (productId: string): Promise<boolean> => {
		isLoading.value = true
		error.value = null

		try {
			await databases.deleteDocument(databaseId, collectionId, productId)
			products.value = products.value.filter((prod) => prod.$id !== productId)

			handleSuccess('Товар успешно удален')
			return true
		} catch (err: any) {
			console.error('Error deleting product:', err)
			error.value = 'Failed to delete product'
			handleError(err, 'Ошибка удаления товара')
			return false
		} finally {
			isLoading.value = false
		}
	}

	const getProductBySlug = (slug: string): Product | undefined => {
		return products.value.find((product) => product.slug === slug)
	}

	const getProductById = (id: string): Product | undefined => {
		return products.value.find((prod) => prod.$id === id)
	}

	return {
		products: readonly(products),
		product: readonly(product),
		isLoading: readonly(isLoading),
		loading: readonly(isLoading),
		error: readonly(error),
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