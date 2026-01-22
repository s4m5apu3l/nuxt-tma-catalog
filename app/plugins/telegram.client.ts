import { WebApp } from 'vue-tg'

export default defineNuxtPlugin(() => {
	// Initialize Telegram WebApp
	if (process.client && window.Telegram?.WebApp) {
		// Configure WebApp
		WebApp.ready()
		WebApp.expand()
		
		// Set theme parameters
		WebApp.setHeaderColor('bg_color')
		WebApp.setBackgroundColor('bg_color')
		
		// Enable closing confirmation if needed
		WebApp.enableClosingConfirmation()
		
		console.log('Telegram WebApp initialized:', {
			version: WebApp.version,
			platform: WebApp.platform,
			colorScheme: WebApp.colorScheme,
			themeParams: WebApp.themeParams,
			initData: WebApp.initData,
			initDataUnsafe: WebApp.initDataUnsafe
		})
	}
})