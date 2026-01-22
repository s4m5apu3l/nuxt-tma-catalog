import { Client, Account, Databases, Storage } from 'appwrite'
import type { Models } from 'appwrite'

interface AppwriteConfig {
	databaseId: string
	categoriesCollectionId: string
	productsCollectionId: string
	storageBucketId: string
}

// Create a function to initialize Appwrite client
export const createAppwriteClient = () => {
	const config = useRuntimeConfig()

	const client = new Client()
	client.setEndpoint(config.public.appwriteEndpoint).setProject(config.public.appwriteProjectId)

	return {
		client,
		account: new Account(client),
		databases: new Databases(client),
		storage: new Storage(client),
		config: {
			databaseId: config.public.appwriteDatabaseId || '',
			categoriesCollectionId: config.public.appwriteCategoriesCollectionId || '',
			productsCollectionId: config.public.appwriteProductsCollectionId || '',
			storageBucketId: config.public.appwriteStorageBucketId || ''
		} as AppwriteConfig
	}
}

// Initialize anonymous session for public users
export const ensureAnonymousSession = async (): Promise<Models.Session | null> => {
	try {
		const { account } = createAppwriteClient()

		// Try to get current session first
		try {
			const session = await account.getSession('current')
			return session
		} catch {
			// No current session, create anonymous session
			console.log('Creating anonymous session for public access')
			const session = await account.createAnonymousSession()
			return session
		}
	} catch (error) {
		console.error('Failed to ensure anonymous session:', error)
		return null
	}
}

// Validate public read access for collections
export const validatePublicReadAccess = async (): Promise<{
	categories: boolean
	products: boolean
	storage: boolean
}> => {
	const { databases, storage, config } = createAppwriteClient()
	const result = {
		categories: false,
		products: false,
		storage: false
	}

	try {
		// Ensure anonymous session exists
		await ensureAnonymousSession()

		// Test categories collection read access
		try {
			await databases.listDocuments(config.databaseId, config.categoriesCollectionId, [])
			result.categories = true
			console.log('✓ Categories collection has public read access')
		} catch (error) {
			console.warn('✗ Categories collection lacks public read access:', error)
		}

		// Test products collection read access
		try {
			await databases.listDocuments(config.databaseId, config.productsCollectionId, [])
			result.products = true
			console.log('✓ Products collection has public read access')
		} catch (error) {
			console.warn('✗ Products collection lacks public read access:', error)
		}

		// Test storage read access
		try {
			await storage.listFiles(config.storageBucketId)
			result.storage = true
			console.log('✓ Storage bucket has public read access')
		} catch (error) {
			console.warn('✗ Storage bucket lacks public read access:', error)
		}
	} catch (error) {
		console.error('Failed to validate public read access:', error)
	}

	return result
}

// Legacy exports for backward compatibility - these will be initialized lazily
let _client: Client | null = null
let _account: Account | null = null
let _databases: Databases | null = null
let _storage: Storage | null = null
let _appwriteConfig: AppwriteConfig | null = null

const getAppwriteInstance = () => {
	if (!_client) {
		const instance = createAppwriteClient()
		_client = instance.client
		_account = instance.account
		_databases = instance.databases
		_storage = instance.storage
		_appwriteConfig = instance.config
	}
	return {
		client: _client!,
		account: _account!,
		databases: _databases!,
		storage: _storage!,
		appwriteConfig: _appwriteConfig!
	}
}

export const client = new Proxy({} as Client, {
	get(_, prop) {
		return getAppwriteInstance().client[prop as keyof Client]
	}
})

export const account = new Proxy({} as Account, {
	get(_, prop) {
		return getAppwriteInstance().account[prop as keyof Account]
	}
})

export const databases = new Proxy({} as Databases, {
	get(_, prop) {
		return getAppwriteInstance().databases[prop as keyof Databases]
	}
})

export const storage = new Proxy({} as Storage, {
	get(_, prop) {
		return getAppwriteInstance().storage[prop as keyof Storage]
	}
})

export const appwriteConfig = new Proxy({} as AppwriteConfig, {
	get(_, prop) {
		return getAppwriteInstance().appwriteConfig[prop as keyof AppwriteConfig]
	}
})
