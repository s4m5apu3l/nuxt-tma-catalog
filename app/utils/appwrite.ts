import { Client, Account, Databases, Storage } from 'appwrite'
import type { Models } from 'appwrite'

interface AppwriteConfig {
	databaseId: string
	categoriesCollectionId: string
	productsCollectionId: string
	usersCollectionId: string
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
			usersCollectionId: config.public.appwriteUsersCollectionId || '',
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
	users: boolean
	storage: boolean
}> => {
	const { databases, storage, config } = createAppwriteClient()
	const result = {
		categories: false,
		products: false,
		users: false,
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

		// Test users collection read access (should be restricted)
		try {
			await databases.listDocuments(config.databaseId, config.usersCollectionId, [])
			result.users = true
			console.log('✓ Users collection accessible (this should be restricted for security)')
		} catch (error) {
			console.log('✓ Users collection properly restricted from public access')
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

// Create or get user document in Users collection
export const createOrGetUserDocument = async (telegramUser: any): Promise<Models.Document | null> => {
	try {
		const { databases, config } = createAppwriteClient()
		const userId = `telegram_${telegramUser.id}`

		// Try to get existing user document
		try {
			const existingUser = await databases.getDocument(config.databaseId, config.usersCollectionId, userId)
			
			// Update last active timestamp
			await databases.updateDocument(config.databaseId, config.usersCollectionId, userId, {
				lastActive: new Date().toISOString(),
				firstName: telegramUser.first_name,
				lastName: telegramUser.last_name || '',
				username: telegramUser.username || '',
				languageCode: telegramUser.language_code || '',
				isPremium: telegramUser.is_premium || false,
				photoUrl: telegramUser.photo_url || ''
			})

			return existingUser
		} catch (error: any) {
			if (error.code === 404) {
				// User doesn't exist, create new one
				const newUser = await databases.createDocument(
					config.databaseId,
					config.usersCollectionId,
					userId,
					{
						telegramId: telegramUser.id,
						firstName: telegramUser.first_name,
						lastName: telegramUser.last_name || '',
						username: telegramUser.username || '',
						languageCode: telegramUser.language_code || '',
						isPremium: telegramUser.is_premium || false,
						photoUrl: telegramUser.photo_url || '',
						isAdmin: false, // Default to false, can be updated manually
						lastActive: new Date().toISOString()
					}
				)
				return newUser
			}
			throw error
		}
	} catch (error) {
		console.error('Error creating/getting user document:', error)
		return null
	}
}

// Check if user is admin based on Users collection
export const checkUserAdminStatus = async (telegramId: number): Promise<boolean> => {
	try {
		const { databases, config } = createAppwriteClient()
		const userId = `telegram_${telegramId}`

		const userDoc = await databases.getDocument(config.databaseId, config.usersCollectionId, userId)
		return userDoc.isAdmin === true
	} catch (error) {
		console.error('Error checking admin status:', error)
		return false
	}
}

// Enhanced error handling for Appwrite operations
export const handleAppwriteError = (error: any): string => {
	console.error('Appwrite error:', error)

	if (error.code === 401) {
		return 'Authentication required. Please log in.'
	}
	if (error.code === 403) {
		return 'Access denied. You do not have permission to perform this action.'
	}
	if (error.code === 404) {
		return 'Resource not found.'
	}
	if (error.code === 409) {
		return 'Resource already exists.'
	}
	if (error.code === 429) {
		return 'Too many requests. Please try again later.'
	}
	if (error.code === 500) {
		return 'Server error. Please try again later.'
	}

	return error.message || 'An unexpected error occurred.'
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
