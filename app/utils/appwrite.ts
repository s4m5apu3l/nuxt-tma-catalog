import { Client, Account, Databases, Storage } from 'appwrite'

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
		}
	}
}

// Legacy exports for backward compatibility - these will be initialized lazily
let _client: Client | null = null
let _account: Account | null = null
let _databases: Databases | null = null
let _storage: Storage | null = null
let _appwriteConfig: any = null

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
	get(target, prop) {
		return getAppwriteInstance().client[prop as keyof Client]
	}
})

export const account = new Proxy({} as Account, {
	get(target, prop) {
		return getAppwriteInstance().account[prop as keyof Account]
	}
})

export const databases = new Proxy({} as Databases, {
	get(target, prop) {
		return getAppwriteInstance().databases[prop as keyof Databases]
	}
})

export const storage = new Proxy({} as Storage, {
	get(target, prop) {
		return getAppwriteInstance().storage[prop as keyof Storage]
	}
})

export const appwriteConfig = new Proxy({} as unknown, {
	get(target, prop) {
		return getAppwriteInstance().appwriteConfig[prop as string]
	}
})
