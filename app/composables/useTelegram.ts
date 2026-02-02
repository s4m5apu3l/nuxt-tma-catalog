export const useTelegram = () => {
	const webApp = ref<any>(null)
	const user = ref<any>(null)
	const themeParams = ref<any>(null)
	const isReady = ref(false)

	const init = () => {
		if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
			webApp.value = window.Telegram.WebApp
			user.value = webApp.value.initDataUnsafe?.user
			themeParams.value = webApp.value.themeParams

			// Configure WebApp
			webApp.value.ready()
			webApp.value.expand()
			webApp.value.enableClosingConfirmation()

			isReady.value = true
		}
	}

	const openTelegramLink = (url: string) => {
		if (webApp.value) {
			webApp.value.openTelegramLink(url)
		}
	}

	const openLink = (url: string, options?: { try_instant_view?: boolean }) => {
		if (webApp.value) {
			webApp.value.openLink(url, options)
		}
	}

	const showAlert = (message: string) => {
		if (webApp.value) {
			webApp.value.showAlert(message)
		}
	}

	const showConfirm = (message: string): Promise<boolean> => {
		return new Promise((resolve) => {
			if (webApp.value) {
				webApp.value.showConfirm(message, resolve)
			} else {
				resolve(false)
			}
		})
	}

	const close = () => {
		if (webApp.value) {
			webApp.value.close()
		}
	}

	// Initialize on mount
	onMounted(() => {
		init()
	})

	return {
		webApp: readonly(webApp),
		user: readonly(user),
		themeParams: readonly(themeParams),
		isReady: readonly(isReady),
		init,
		openTelegramLink,
		openLink,
		showAlert,
		showConfirm,
		close
	}
}
