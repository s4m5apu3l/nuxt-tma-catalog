import type { Category, CreateCategoryData, UpdateCategoryData } from '~/types'
import { Query, ID } from 'appwrite'

// Глобальное состояние для кеширования
const globalCategories = ref<Category[]>([])
const globalLoading = ref(false)
const globalError = ref<string | null>(null)
const lastFetchTime = ref<number>(0)
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

const parseCategory = (doc: any): Category => {
	return {
		...doc,
		name: typeof doc.name === 'string' ? JSON.parse(doc.name) : doc.name,
		description: typeof doc.description === 'string' ? JSON.parse(doc.description) : doc.description
	} as Category
}

export const useCategories = () => {
	const { databases } = useAppwrite()
	const { handleError, handleSuccess } = useErrorHandler()
	const config = useRuntimeConfig()

	const databaseId: string = config.public.appwriteBdKey
	const collectionId: string = config.public.appwriteCollectionCategories

	const isCacheValid = (): boolean => {
		return Date.now() - lastFetchTime.value < CACHE_DURATION && globalCategories.value.length > 0
	}

	const fetchCategories = async (forceRefresh = false): Promise<void> => {
		// Используем кеш если он валиден
		if (!forceRefresh && isCacheValid()) {
			return
		}

		globalLoading.value = true
		globalError.value = null

		try {
			const response = await databases.listDocuments(databaseId, collectionId, [
				Query.equal('isActive', true),
				Query.orderAsc('sortOrder'),
				Query.orderDesc('$createdAt')
			])

			globalCategories.value = response.documents.map(parseCategory)
			lastFetchTime.value = Date.now()
		} catch (err: any) {
			console.error('Error fetching categories:', err)
			globalError.value = 'Failed to fetch categories'
			handleError(err, 'Ошибка загрузки категорий')
		} finally {
			globalLoading.value = false
		}
	}

	const createCategory = async (data: CreateCategoryData): Promise<Category | null> => {
		globalLoading.value = true
		globalError.value = null

		try {
			const response = await databases.createDocument(databaseId, collectionId, ID.unique(), {
				...data,
				name: JSON.stringify(data.name),
				description: JSON.stringify(data.description),
				sortOrder: data.sortOrder ?? 0,
				isActive: data.isActive ?? true
			})

			const newCategory = parseCategory(response)
			globalCategories.value.push(newCategory)
			globalCategories.value.sort((a, b) => a.sortOrder - b.sortOrder)

			handleSuccess('Категория успешно создана')
			return newCategory
		} catch (err: any) {
			console.error('Error creating category:', err)
			globalError.value = 'Failed to create category'
			handleError(err, 'Ошибка создания категории')
			return null
		} finally {
			globalLoading.value = false
		}
	}

	const updateCategory = async (data: UpdateCategoryData): Promise<Category | null> => {
		globalLoading.value = true
		globalError.value = null

		try {
			const { $id, ...updateData } = data
			const response = await databases.updateDocument(databaseId, collectionId, $id, {
				...updateData,
				name: JSON.stringify(updateData.name),
				description: JSON.stringify(updateData.description)
			})

			const updatedCategory = parseCategory(response)
			const index = globalCategories.value.findIndex((cat) => cat.$id === $id)
			if (index !== -1) {
				globalCategories.value[index] = updatedCategory
			}

			handleSuccess('Категория успешно обновлена')
			return updatedCategory
		} catch (err: any) {
			console.error('Error updating category:', err)
			globalError.value = 'Failed to update category'
			handleError(err, 'Ошибка обновления категории')
			return null
		} finally {
			globalLoading.value = false
		}
	}

	const deleteCategory = async (categoryId: string): Promise<boolean> => {
		globalLoading.value = true
		globalError.value = null

		try {
			await databases.deleteDocument(databaseId, collectionId, categoryId)
			globalCategories.value = globalCategories.value.filter((cat) => cat.$id !== categoryId)

			handleSuccess('Категория успешно удалена')
			return true
		} catch (err: any) {
			console.error('Error deleting category:', err)
			globalError.value = 'Failed to delete category'
			handleError(err, 'Ошибка удаления категории')
			return false
		} finally {
			globalLoading.value = false
		}
	}

	const getCategoryBySlug = (slug: string): Category | undefined => {
		return globalCategories.value.find((cat) => cat.slug === slug)
	}

	const getCategoryById = (id: string): Category | undefined => {
		return globalCategories.value.find((cat) => cat.$id === id)
	}

	const fetchAllCategories = async (): Promise<void> => {
		globalLoading.value = true
		globalError.value = null

		try {
			const response = await databases.listDocuments(databaseId, collectionId, [
				Query.orderAsc('sortOrder'),
				Query.orderDesc('$createdAt')
			])

			globalCategories.value = response.documents.map(parseCategory)
			lastFetchTime.value = Date.now()
		} catch (err: any) {
			console.error('Error fetching all categories:', err)
			globalError.value = 'Failed to fetch all categories'
			handleError(err, 'Ошибка загрузки всех категорий')
		} finally {
			globalLoading.value = false
		}
	}

	const getActiveCategories = (): Category[] => {
		return globalCategories.value.filter((cat) => cat.isActive)
	}

	return {
		categories: readonly(globalCategories),
		loading: readonly(globalLoading),
		error: readonly(globalError),
		fetchCategories,
		fetchAllCategories,
		createCategory,
		updateCategory,
		deleteCategory,
		getCategoryBySlug,
		getCategoryById,
		getActiveCategories
	}
}
