import type { Category, CreateCategoryData, UpdateCategoryData } from '~/types'
import { Query, ID } from 'appwrite'

const config = useRuntimeConfig()

const databaseId: string = config.public.appwriteBdKey
const collectionId: string = config.public.appwriteCollectionCategories

const categories = ref<Category[] | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useCategories = () => {
	const { databases } = useAppwrite()

	const fetchCategories = async (): Promise<void> => {
		loading.value = true
		error.value = null

		try {
			const response = await databases.listDocuments(databaseId, collectionId, [
				Query.equal('isActive', true),
				Query.orderAsc('sortOrder'),
				Query.orderDesc('$createdAt')
			])

			categories.value = response.documents as unknown as Category[]
		} catch (err) {
			console.error('Error fetching categories:', err)
			error.value = 'Failed to fetch categories'
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
				sortOrder: data.sortOrder ?? 0,
				isActive: data.isActive ?? true
			})

			const newCategory = response as unknown as Category
			if (categories.value) {
				categories.value.push(newCategory)
				// Re-sort categories
				categories.value.sort((a, b) => a.sortOrder - b.sortOrder)
			}

			return newCategory
		} catch (err) {
			console.error('Error creating category:', err)
			error.value = 'Failed to create category'
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
			const response = await databases.updateDocument(databaseId, collectionId, $id, updateData)

			const updatedCategory = response as unknown as Category
			if (categories.value) {
				const index = categories.value.findIndex((cat) => cat.$id === $id)
				if (index !== -1) {
					categories.value[index] = updatedCategory
				}
			}

			return updatedCategory
		} catch (err) {
			console.error('Error updating category:', err)
			error.value = 'Failed to update category'
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

			if (categories.value) {
				categories.value = categories.value.filter((cat) => cat.$id !== categoryId)
			}

			return true
		} catch (err) {
			console.error('Error deleting category:', err)
			error.value = 'Failed to delete category'
			return false
		} finally {
			loading.value = false
		}
	}

	const getCategoryBySlug = (slug: string): Category | undefined => {
		return categories.value?.find((cat) => cat.slug === slug)
	}

	const getCategoryById = (id: string): Category | undefined => {
		return categories.value?.find((cat) => cat.$id === id)
	}

	return {
		categories,
		loading,
		error,
		fetchCategories,
		createCategory,
		updateCategory,
		deleteCategory,
		getCategoryBySlug,
		getCategoryById
	}
}
