import type { Category, CreateCategoryData, UpdateCategoryData } from '~/types'
import { Query, ID } from 'appwrite'

const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

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

	const fetchCategories = async (): Promise<void> => {
		loading.value = true
		error.value = null

		try {
			const response = await databases.listDocuments(databaseId, collectionId, [
				Query.equal('isActive', true),
				Query.orderAsc('sortOrder'),
				Query.orderDesc('$createdAt')
			])

			categories.value = response.documents.map(parseCategory)
		} catch (err: any) {
			console.error('Error fetching categories:', err)
			error.value = 'Failed to fetch categories'
			handleError(err, 'Ошибка загрузки категорий')
		} finally {
			loading.value = false
		}
	}

	const createCategory = async (data: CreateCategoryData): Promise<Category | null> => {
		loading.value = true
		error.value = null

		try {
			const response = await databases.createDocument(databaseId, collectionId, ID.unique(), {
				...data,
				name: JSON.stringify(data.name),
				description: JSON.stringify(data.description),
				sortOrder: data.sortOrder ?? 0,
				isActive: data.isActive ?? true
			})

			const newCategory = parseCategory(response)
			categories.value.push(newCategory)
			categories.value.sort((a, b) => a.sortOrder - b.sortOrder)

			handleSuccess('Категория успешно создана')
			return newCategory
		} catch (err: any) {
			console.error('Error creating category:', err)
			error.value = 'Failed to create category'
			handleError(err, 'Ошибка создания категории')
			return null
		} finally {
			loading.value = false
		}
	}

	const updateCategory = async (data: UpdateCategoryData): Promise<Category | null> => {
		loading.value = true
		error.value = null

		try {
			const { $id, ...updateData } = data
			const response = await databases.updateDocument(databaseId, collectionId, $id, {
				...updateData,
				name: JSON.stringify(updateData.name),
				description: JSON.stringify(updateData.description)
			})

			const updatedCategory = parseCategory(response)
			const index = categories.value.findIndex((cat) => cat.$id === $id)
			if (index !== -1) {
				categories.value[index] = updatedCategory
			}

			handleSuccess('Категория успешно обновлена')
			return updatedCategory
		} catch (err: any) {
			console.error('Error updating category:', err)
			error.value = 'Failed to update category'
			handleError(err, 'Ошибка обновления категории')
			return null
		} finally {
			loading.value = false
		}
	}

	const deleteCategory = async (categoryId: string): Promise<boolean> => {
		loading.value = true
		error.value = null

		try {
			await databases.deleteDocument(databaseId, collectionId, categoryId)
			categories.value = categories.value.filter((cat) => cat.$id !== categoryId)

			handleSuccess('Категория успешно удалена')
			return true
		} catch (err: any) {
			console.error('Error deleting category:', err)
			error.value = 'Failed to delete category'
			handleError(err, 'Ошибка удаления категории')
			return false
		} finally {
			loading.value = false
		}
	}

	const getCategoryBySlug = (slug: string): Category | undefined => {
		return categories.value.find((cat) => cat.slug === slug)
	}

	const getCategoryById = (id: string): Category | undefined => {
		return categories.value.find((cat) => cat.$id === id)
	}

	const fetchAllCategories = async (): Promise<void> => {
		loading.value = true
		error.value = null

		try {
			const response = await databases.listDocuments(databaseId, collectionId, [
				Query.orderAsc('sortOrder'),
				Query.orderDesc('$createdAt')
			])

			categories.value = response.documents.map(parseCategory)
		} catch (err: any) {
			console.error('Error fetching all categories:', err)
			error.value = 'Failed to fetch all categories'
			handleError(err, 'Ошибка загрузки всех категорий')
		} finally {
			loading.value = false
		}
	}

	const getActiveCategories = (): Category[] => {
		return categories.value.filter((cat) => cat.isActive)
	}

	return {
		categories: readonly(categories),
		loading: readonly(loading),
		error: readonly(error),
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
