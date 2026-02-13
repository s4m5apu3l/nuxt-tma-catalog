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

			webApp.value.ready()
			webApp.value.expand()
			webApp.value.enableClosingConfirmation()

			isReady.value = true
		}
	}

	const showBackButton = (onClick: () => void) => {
		if (webApp.value?.BackButton) {
			webApp.value.BackButton.show()
			webApp.value.BackButton.onClick(onClick)
		}
	}

	const hideBackButton = () => {
		if (webApp.value?.BackButton) {
			webApp.value.BackButton.hide()
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

	const showPopup = (params: {
		title?: string
		message: string
		buttons: Array<{ id?: string; type?: string; text: string }>
	}): Promise<string | null> => {
		return new Promise((resolve) => {
			if (webApp.value) {
				webApp.value.showPopup(params, (buttonId: string) => {
					resolve(buttonId || null)
				})
			} else {
				resolve(null)
			}
		})
	}

	const openChat = (username: string): void => {
		if (webApp.value) {
			const cleanUsername = username.replace('@', '')
			webApp.value.openTelegramLink(`https://t.me/${cleanUsername}`)
		}
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
		showPopup,
		openChat,
		close,
		showBackButton,
		hideBackButton
	}
}
