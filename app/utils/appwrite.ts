import { Client, TablesDB, Account } from 'appwrite'

interface AppwriteServices {
	account: Account
	tablesDB: TablesDB
}

interface AppwriteConfig {
	endpoint: string
	projectId: string
}

const createAppwriteClient = (config: AppwriteConfig): Client => {
	const client = new Client()
	return client.setEndpoint(config.endpoint).setProject(config.projectId)
}

let clientInstance: Client | null = null

export const useAppwrite = (): AppwriteServices => {
	if (!clientInstance) {
		const config = useRuntimeConfig()

		if (!config.public.appwriteEndpoint || !config.public.appwriteProjectId) {
			throw new Error('Appwrite configuration is missing. Please check your environment variables.')
		}

		clientInstance = createAppwriteClient({
			endpoint: config.public.appwriteEndpoint,
			projectId: config.public.appwriteProjectId
		})
	}

	return {
		account: new Account(clientInstance),
		tablesDB: new TablesDB(clientInstance)
	}
}
