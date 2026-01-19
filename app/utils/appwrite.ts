import { Client, Account, Databases, Storage } from 'appwrite'

// Initialize Appwrite client
const client = new Client()

// Get runtime config
const config = useRuntimeConfig()

// Configure client with runtime config
client
	.setEndpoint(config.public.appwriteEndpoint || 'https://cloud.appwrite.io/v1')
	.setProject(config.public.appwriteProjectId || '')

// Initialize services
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Export client instance for direct access if needed
export { client }

// Export configuration constants
export const appwriteConfig = {
	databaseId: config.public.appwriteDatabaseId || '',
	categoriesCollectionId: config.public.appwriteCategoriesCollectionId || '',
	productsCollectionId: config.public.appwriteProductsCollectionId || '',
	storageBucketId: config.public.appwriteStorageBucketId || ''
}
