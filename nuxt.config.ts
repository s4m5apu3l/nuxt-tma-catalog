// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n'],

	devtools: {
		enabled: true
	},

	css: ['~/assets/css/main.css'],

	routeRules: {
		'/': { prerender: true }
	},

	compatibilityDate: '2025-01-15',

	eslint: {
		config: {
			stylistic: {
				commaDangle: 'never',
				braceStyle: '1tbs'
			}
		}
	},

	i18n: {
		locales: [
			{
				code: 'en',
				name: 'English',
				file: 'en.json'
			},
			{
				code: 'ru',
				name: 'Русский',
				file: 'ru.json'
			}
		],
		defaultLocale: 'en',
		strategy: 'prefix_except_default',
		// langDir: 'locales/'
	},

	runtimeConfig: {
		// Private keys (only available on server-side)
		appwriteApiKey: process.env.APPWRITE_API_KEY,
		
		// Public keys (exposed to client-side)
		public: {
			appwriteEndpoint: process.env.APPWRITE_ENDPOINT,
			appwriteProjectId: process.env.APPWRITE_PROJECT_ID,
			appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID,
			appwriteCategoriesCollectionId: process.env.APPWRITE_CATEGORIES_COLLECTION_ID,
			appwriteProductsCollectionId: process.env.APPWRITE_PRODUCTS_COLLECTION_ID,
			appwriteStorageBucketId: process.env.APPWRITE_STORAGE_BUCKET_ID
		}
	}
})
