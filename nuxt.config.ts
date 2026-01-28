// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n'],
	ssr: false,

	app: {
		head: {
			// title: 'TMA catalog',
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			script: [
				{
					src: 'https://telegram.org/js/telegram-web-app.js'
				}
			]
		},
		// for static deploy gh-pages need to baseURL: '/<repository-name>/'
		baseURL: '/nuxt-tma-catalog/',
		buildAssetsDir: 'assets'
	},

	css: ['~/assets/css/main.css'],

	// spa loader
	spaLoadingTemplate: 'spa-loader.html',

	runtimeConfig: {
		// Private keys (only available on server-side)
		appwriteApiKey: process.env.APPWRITE_API_KEY,
		tmaToken: process.env.TELEGRAM_BOT_TOKEN,

		// Public keys (exposed to client-side)
		public: {
			appwriteEndpoint: process.env.APPWRITE_ENDPOINT,
			appwriteProjectId: process.env.APPWRITE_PROJECT_ID,
			appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID,
			appwriteCategoriesCollectionId: process.env.APPWRITE_CATEGORIES_COLLECTION_ID,
			appwriteProductsCollectionId: process.env.APPWRITE_PRODUCTS_COLLECTION_ID,
			appwriteUsersCollectionId: process.env.APPWRITE_USERS_COLLECTION_ID,
			appwriteStorageBucketId: process.env.APPWRITE_STORAGE_BUCKET_ID
		}
	},

	compatibilityDate: '2026-01-19',
	hooks: {
		'prerender:routes'({ routes }) {
			routes.clear()
		}
	},

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
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			redirectOn: 'root'
		}
	}
})
