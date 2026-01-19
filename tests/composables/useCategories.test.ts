import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCategories } from '~/composables/useCategories'

// Mock Appwrite databases
const mockDatabases = {
  listDocuments: vi.fn(),
  getDocument: vi.fn(),
  createDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn()
}

// Mock Appwrite config
const mockAppwriteConfig = {
  databaseId: 'test-db',
  categoriesCollectionId: 'test-categories',
  productsCollectionId: 'test-products',
  storageBucketId: 'test-storage'
}

// Mock the appwrite utils
vi.mock('~/utils/appwrite', () => ({
  databases: mockDatabases,
  appwriteConfig: mockAppwriteConfig
}))

// Mock Appwrite Query and ID
vi.mock('appwrite', () => ({
  Query: {
    orderAsc: vi.fn((field) => `orderAsc(${field})`),
    equal: vi.fn((field, value) => `equal(${field}, ${value})`)
  },
  ID: {
    unique: vi.fn(() => 'unique-id')
  }
}))

describe('useCategories', () => {
  const mockCategory = {
    $id: '123',
    name: 'Test Category',
    slug: 'test-category',
    $createdAt: '2024-01-01T00:00:00.000Z',
    $updatedAt: '2024-01-01T00:00:00.000Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchCategories', () => {
    it('should successfully fetch categories', async () => {
      const mockResponse = {
        documents: [mockCategory]
      }
      mockDatabases.listDocuments.mockResolvedValue(mockResponse)

      const { fetchCategories, categories, isLoading } = useCategories()
      
      await fetchCategories()

      expect(mockDatabases.listDocuments).toHaveBeenCalledWith(
        'test-db',
        'test-categories',
        ['orderAsc(name)']
      )
      expect(categories.value).toEqual([mockCategory])
      expect(isLoading.value).toBe(false)
    })

    it('should handle fetch errors', async () => {
      mockDatabases.listDocuments.mockRejectedValue(new Error('Network error'))

      const { fetchCategories, error } = useCategories()
      
      await fetchCategories()

      expect(error.value).toBe('Failed to load categories. Please try again.')
    })
  })

  describe('getCategoryById', () => {
    it('should successfully get category by ID', async () => {
      mockDatabases.getDocument.mockResolvedValue(mockCategory)

      const { getCategoryById } = useCategories()
      
      const result = await getCategoryById('123')

      expect(mockDatabases.getDocument).toHaveBeenCalledWith(
        'test-db',
        'test-categories',
        '123'
      )
      expect(result).toEqual(mockCategory)
    })

    it('should handle category not found', async () => {
      mockDatabases.getDocument.mockRejectedValue({ code: 404 })

      const { getCategoryById, error } = useCategories()
      
      const result = await getCategoryById('nonexistent')

      expect(result).toBe(null)
      expect(error.value).toBe('Category not found')
    })

    it('should handle other errors', async () => {
      mockDatabases.getDocument.mockRejectedValue(new Error('Network error'))

      const { getCategoryById, error } = useCategories()
      
      const result = await getCategoryById('123')

      expect(result).toBe(null)
      expect(error.value).toBe('Failed to load category. Please try again.')
    })
  })

  describe('getCategoryBySlug', () => {
    it('should successfully get category by slug', async () => {
      const mockResponse = {
        documents: [mockCategory]
      }
      mockDatabases.listDocuments.mockResolvedValue(mockResponse)

      const { getCategoryBySlug } = useCategories()
      
      const result = await getCategoryBySlug('test-category')

      expect(mockDatabases.listDocuments).toHaveBeenCalledWith(
        'test-db',
        'test-categories',
        ['equal(slug, test-category)']
      )
      expect(result).toEqual(mockCategory)
    })

    it('should handle category not found by slug', async () => {
      const mockResponse = {
        documents: []
      }
      mockDatabases.listDocuments.mockResolvedValue(mockResponse)

      const { getCategoryBySlug, error } = useCategories()
      
      const result = await getCategoryBySlug('nonexistent')

      expect(result).toBe(null)
      expect(error.value).toBe('Category not found')
    })
  })

  describe('createCategory', () => {
    it('should successfully create category', async () => {
      const newCategoryData = {
        name: 'New Category',
        slug: 'new-category'
      }
      
      // Mock slug check (no existing category)
      mockDatabases.listDocuments.mockResolvedValue({ documents: [] })
      mockDatabases.createDocument.mockResolvedValue(mockCategory)

      const { createCategory, categories } = useCategories()
      
      const result = await createCategory(newCategoryData)

      expect(mockDatabases.createDocument).toHaveBeenCalledWith(
        'test-db',
        'test-categories',
        'unique-id',
        newCategoryData
      )
      expect(result).toEqual(mockCategory)
      expect(categories.value).toContain(mockCategory)
    })

    it('should auto-generate slug when not provided', async () => {
      const newCategoryData = {
        name: 'New Category',
        slug: ''
      }
      
      mockDatabases.listDocuments.mockResolvedValue({ documents: [] })
      mockDatabases.createDocument.mockResolvedValue(mockCategory)

      const { createCategory } = useCategories()
      
      await createCategory(newCategoryData)

      expect(mockDatabases.createDocument).toHaveBeenCalledWith(
        'test-db',
        'test-categories',
        'unique-id',
        {
          name: 'New Category',
          slug: 'new-category'
        }
      )
    })

    it('should validate required fields', async () => {
      const { createCategory, error } = useCategories()
      
      const result = await createCategory({ name: '', slug: 'test' })

      expect(result).toBe(null)
      expect(error.value).toBe('Category name is required')
      expect(mockDatabases.createDocument).not.toHaveBeenCalled()
    })

    it('should validate name length', async () => {
      const longName = 'a'.repeat(101)
      const { createCategory, error } = useCategories()
      
      const result = await createCategory({ name: longName, slug: 'test' })

      expect(result).toBe(null)
      expect(error.value).toBe('Category name must be 100 characters or less')
    })

    it('should validate slug format', async () => {
      const { createCategory, error } = useCategories()
      
      const result = await createCategory({ 
        name: 'Test Category', 
        slug: 'Invalid Slug!' 
      })

      expect(result).toBe(null)
      expect(error.value).toBe('Slug can only contain lowercase letters, numbers, and hyphens')
    })

    it('should handle duplicate slug error', async () => {
      // Mock existing category with same slug
      mockDatabases.listDocuments.mockResolvedValue({ 
        documents: [mockCategory] 
      })

      const { createCategory, error } = useCategories()
      
      const result = await createCategory({
        name: 'Another Category',
        slug: 'test-category'
      })

      expect(result).toBe(null)
      expect(error.value).toBe('A category with this slug already exists')
    })

    it('should handle creation errors', async () => {
      mockDatabases.listDocuments.mockResolvedValue({ documents: [] })
      mockDatabases.createDocument.mockRejectedValue({ code: 400 })

      const { createCategory, error } = useCategories()
      
      const result = await createCategory({
        name: 'Test Category',
        slug: 'test-category'
      })

      expect(result).toBe(null)
      expect(error.value).toBe('Invalid category data. Please check your input.')
    })
  })

  describe('updateCategory', () => {
    it('should successfully update category', async () => {
      const updateData = { name: 'Updated Category' }
      const updatedCategory = { ...mockCategory, name: 'Updated Category' }
      
      mockDatabases.updateDocument.mockResolvedValue(updatedCategory)

      const { updateCategory, categories } = useCategories()
      
      // Add category to state first
      categories.value.push(mockCategory)
      
      const result = await updateCategory('123', updateData)

      expect(mockDatabases.updateDocument).toHaveBeenCalledWith(
        'test-db',
        'test-categories',
        '123',
        updateData
      )
      expect(result).toEqual(updatedCategory)
    })

    it('should validate update data', async () => {
      const { updateCategory, error } = useCategories()
      
      const result = await updateCategory('123', { name: '' })

      expect(result).toBe(null)
      expect(error.value).toBe('Category name is required')
    })

    it('should check for duplicate slug on update', async () => {
      const anotherCategory = { ...mockCategory, $id: '456', slug: 'another-slug' }
      
      // Mock existing category with target slug
      mockDatabases.listDocuments.mockResolvedValue({ 
        documents: [anotherCategory] 
      })

      const { updateCategory, error } = useCategories()
      
      const result = await updateCategory('123', { slug: 'another-slug' })

      expect(result).toBe(null)
      expect(error.value).toBe('A category with this slug already exists')
    })

    it('should handle update errors', async () => {
      mockDatabases.updateDocument.mockRejectedValue({ code: 404 })

      const { updateCategory, error } = useCategories()
      
      const result = await updateCategory('nonexistent', { name: 'Test' })

      expect(result).toBe(null)
      expect(error.value).toBe('Category not found')
    })
  })

  describe('deleteCategory', () => {
    it('should successfully delete category', async () => {
      mockDatabases.deleteDocument.mockResolvedValue({})

      const { deleteCategory, categories } = useCategories()
      
      // Add category to state first
      categories.value.push(mockCategory)
      
      const result = await deleteCategory('123')

      expect(mockDatabases.deleteDocument).toHaveBeenCalledWith(
        'test-db',
        'test-categories',
        '123'
      )
      expect(result).toBe(true)
      expect(categories.value).not.toContain(mockCategory)
    })

    it('should handle delete errors', async () => {
      mockDatabases.deleteDocument.mockRejectedValue({ code: 404 })

      const { deleteCategory, error } = useCategories()
      
      const result = await deleteCategory('nonexistent')

      expect(result).toBe(false)
      expect(error.value).toBe('Category not found')
    })
  })

  describe('generateSlug', () => {
    it('should generate valid slug from name', () => {
      const { generateSlug } = useCategories()
      
      expect(generateSlug('Test Category')).toBe('test-category')
      expect(generateSlug('Special Characters!')).toBe('special-characters')
      expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces')
      expect(generateSlug('Under_scores')).toBe('under-scores')
      expect(generateSlug('123 Numbers')).toBe('123-numbers')
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      const { createCategory, error, clearError } = useCategories()
      
      // Trigger an error
      await createCategory({ name: '', slug: 'test' })
      expect(error.value).toBeTruthy()
      
      // Clear the error
      clearError()
      expect(error.value).toBe(null)
    })
  })
})