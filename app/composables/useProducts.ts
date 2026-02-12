import { Query } from 'appwrite'
import type { Product, PricingOption } from '~/types'

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
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async (categoryId?: string): Promise<Product[]> => {
    isLoading.value = true
    error.value = null
    
    try {
      const { databases } = useAppwrite()
      const config = useRuntimeConfig()
      
      const queries = [Query.equal('isActive', true)]
      if (categoryId) {
        queries.push(Query.equal('categoryId', categoryId))
      }
      
      const response = await databases.listDocuments(
        config.public.appwriteBdKey,
        config.public.appwriteCollectionProducts,
        queries
      )
      
      products.value = response.documents.map(parseProduct)
      return products.value
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
      const { databases } = useAppwrite()
      const config = useRuntimeConfig()
      
      const response = await databases.listDocuments(
        config.public.appwriteBdKey,
        config.public.appwriteCollectionProducts
      )
      
      products.value = response.documents.map(parseProduct)
      return products.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.value.find(product => product.slug === slug)
  }

  return {
    products: readonly(products),
    isLoading: readonly(isLoading),
    loading: readonly(isLoading),
    error: readonly(error),
    fetchProducts,
    fetchAllProducts,
    getProductBySlug
  } as const
}