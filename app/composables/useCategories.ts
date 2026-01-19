import { databases, appwriteConfig } from '~/utils/appwrite'
import { ID, Query } from 'appwrite'

export interface Category {
	$id: string
	name: string
	slug: string
	$createdAt: string
	$updatedAt: string
}

interface CreateCategoryData {
	name: string
	slug: string
}

interface UpdateCategoryData {
	name?: string
	slug?: string
}

interface CategoriesState {
	categories: Category[]
	isLoading: boolean
	error: string | null
}

export const useCategories = () => {
	// Reactive state
	const state = reactive<CategoriesState>({
		categories: [],
		isLoading: false,
		error: null
	})

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

	// Generate slug from name
	const generateSlug = (name: string): string => {
		return name
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '') // Remove special characters
			.replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
			.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
	}

	// Validate category data
	const validateCategoryData = (data: CreateCategoryData | UpdateCategoryData): string | null => {
		if ('name' in data && data.name !== undefined) {
			if (!data.name || data.name.trim().length === 0) {
				return 'Category name is required'
			}
			if (data.name.length > 100) {
				return 'Category name must be 100 characters or less'
			}
		}

		if ('slug' in data && data.slug !== undefined) {
			if (!data.slug || data.slug.trim().length === 0) {
				return 'Category slug is required'
			}
			if (data.slug.length > 100) {
				return 'Category slug must be 100 characters or less'
			}
			// Validate slug format
			const slugRegex = /^[a-z0-9-]+$/
			if (!slugRegex.test(data.slug)) {
				return 'Slug can only contain lowercase letters, numbers, and hyphens'
			}
		}

		return null
	}

	// Fetch all categories
	const fetchCategories = async (): Promise<void> => {
		try {
			clearError()
			setLoading(true)

			const response = await databases.listDocuments(
				appwriteConfig.databaseId,
				appwriteConfig.categoriesCollectionId,
				[Query.orderAsc('name')]
			)

			state.categories = response.documents as unknown as Category[]
		} catch (error: unknown) {
			console.error('Fetch categories error:', error)
			setError('Failed to load categories. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	// Get category by ID
	const getCategoryById = async (id: string): Promise<Category | null> => {
		try {
			clearError()
			setLoading(true)

			const response = await databases.getDocument(
				appwriteConfig.databaseId,
				appwriteConfig.categoriesCollectionId,
				id
			)

			return response as unknown as Category
		} catch (error: unknown) {
			console.error('Get category error:', error)
			const err = error as { code?: number }
			if (err.code === 404) {
				setError('Category not found')
			} else {
				setError('Failed to load category. Please try again.')
			}
			return null
		} finally {
			setLoading(false)
		}
	}

	// Get category by slug
	const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
		try {
			clearError()
			setLoading(true)

			const response = await databases.listDocuments(
				appwriteConfig.databaseId,
				appwriteConfig.categoriesCollectionId,
				[Query.equal('slug', slug)]
			)

			if (response.documents.length === 0) {
				setError('Category not found')
				return null
			}

			return response.documents[0] as unknown as Category
		} catch (error: unknown) {
			console.error('Get category by slug error:', error)
			setError('Failed to load category. Please try again.')
			return null
		} finally {
			setLoading(false)
		}
	}

	// Create new category
	const createCategory = async (data: CreateCategoryData): Promise<Category | null> => {
		try {
			clearError()
			setLoading(true)

			// Validate data
			const validationError = validateCategoryData(data)
			if (validationError) {
				setError(validationError)
				return null
			}

			// Auto-generate slug if not provided or empty
			const categoryData = {
				...data,
				slug: data.slug || generateSlug(data.name)
			}

			// Check if slug already exists
			const existingCategory = await getCategoryBySlug(categoryData.slug)
			if (existingCategory) {
				setError('A category with this slug already exists')
				return null
			}

			const response = await databases.createDocument(
				appwriteConfig.databaseId,
				appwriteConfig.categoriesCollectionId,
				ID.unique(),
				categoryData
			)

			const newCategory = response as unknown as Category

			// Add to local state
			state.categories.push(newCategory)
			state.categories.sort((a, b) => a.name.localeCompare(b.name))

			return newCategory
		} catch (error: unknown) {
			console.error('Create category error:', error)

			const err = error as { code?: number }
			if (err.code === 409) {
				setError('A category with this slug already exists')
			} else if (err.code === 400) {
				setError('Invalid category data. Please check your input.')
			} else {
				setError('Failed to create category. Please try again.')
			}

			return null
		} finally {
			setLoading(false)
		}
	}

	// Update category
	const updateCategory = async (id: string, data: UpdateCategoryData): Promise<Category | null> => {
		try {
			clearError()
			setLoading(true)

			// Validate data
			const validationError = validateCategoryData(data)
			if (validationError) {
				setError(validationError)
				return null
			}

			// If slug is being updated, check if it already exists
			if (data.slug) {
				const existingCategory = await getCategoryBySlug(data.slug)
				if (existingCategory && existingCategory.$id !== id) {
					setError('A category with this slug already exists')
					return null
				}
			}

			const response = await databases.updateDocument(
				appwriteConfig.databaseId,
				appwriteConfig.categoriesCollectionId,
				id,
				data
			)

			const updatedCategory = response as unknown as Category

			// Update local state
			const index = state.categories.findIndex((cat) => cat.$id === id)
			if (index !== -1) {
				state.categories[index] = updatedCategory
				state.categories.sort((a, b) => a.name.localeCompare(b.name))
			}

			return updatedCategory
		} catch (error: unknown) {
			console.error('Update category error:', error)

			const err = error as { code?: number }
			if (err.code === 404) {
				setError('Category not found')
			} else if (err.code === 409) {
				setError('A category with this slug already exists')
			} else if (err.code === 400) {
				setError('Invalid category data. Please check your input.')
			} else {
				setError('Failed to update category. Please try again.')
			}

			return null
		} finally {
			setLoading(false)
		}
	}

	// Delete category
	const deleteCategory = async (id: string): Promise<boolean> => {
		try {
			clearError()
			setLoading(true)

			await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.categoriesCollectionId, id)

			// Remove from local state
			const index = state.categories.findIndex((cat) => cat.$id === id)
			if (index !== -1) {
				state.categories.splice(index, 1)
			}

			return true
		} catch (error: unknown) {
			console.error('Delete category error:', error)

			const err = error as { code?: number }
			if (err.code === 404) {
				setError('Category not found')
			} else {
				setError('Failed to delete category. Please try again.')
			}

			return false
		} finally {
			setLoading(false)
		}
	}

	return {
		// State (readonly)
		categories: readonly(toRef(state, 'categories')),
		isLoading: readonly(toRef(state, 'isLoading')),
		error: readonly(toRef(state, 'error')),

		// Actions
		fetchCategories,
		getCategoryById,
		getCategoryBySlug,
		createCategory,
		updateCategory,
		deleteCategory,
		clearError,

		// Utilities
		generateSlug
	}
}
