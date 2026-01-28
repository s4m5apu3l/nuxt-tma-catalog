export interface TelegramUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
	is_premium?: boolean
	photo_url?: string
}

export interface TelegramWebAppData {
	user?: TelegramUser
	chat_instance?: string
	chat_type?: string
	auth_date: number
	hash: string
	query_id?: string
	start_param?: string
}

export const useTelegramWebApp = () => {
	const isAvailable = computed(() => {
		return process.client && !!window.Telegram?.WebApp
	})

	const webApp = computed(() => {
		if (!isAvailable.value) return null
		return window.Telegram.WebApp
	})

	const user = computed((): TelegramUser | null => {
		if (!webApp.value?.initDataUnsafe?.user) return null
		return webApp.value.initDataUnsafe.user as TelegramUser
	})

	const initData = computed((): string => {
		return webApp.value?.initData || ''
	})

	const initDataUnsafe = computed((): TelegramWebAppData | null => {
		if (!webApp.value?.initDataUnsafe) return null
		return webApp.value.initDataUnsafe as TelegramWebAppData
	})

	const themeParams = computed(() => {
		return webApp.value?.themeParams || {}
	})

	const colorScheme = computed(() => {
		return webApp.value?.colorScheme || 'light'
	})

	const platform = computed(() => {
		return webApp.value?.platform || 'unknown'
	})

	const version = computed(() => {
		return webApp.value?.version || '6.0'
	})

	const isExpanded = computed(() => {
		return webApp.value?.isExpanded || false
	})

	const viewportHeight = computed(() => {
		return webApp.value?.viewportHeight || 0
	})

	const viewportStableHeight = computed(() => {
		return webApp.value?.viewportStableHeight || 0
	})

	// Methods
	const ready = () => {
		webApp.value?.ready()
	}

	const expand = () => {
		webApp.value?.expand()
	}

	const close = () => {
		webApp.value?.close()
	}

	const showAlert = (message: string, callback?: () => void) => {
		webApp.value?.showAlert(message, callback)
	}

	const showConfirm = (message: string, callback?: (confirmed: boolean) => void) => {
		webApp.value?.showConfirm(message, callback)
	}

	const showPopup = (params: any, callback?: (buttonId: string) => void) => {
		webApp.value?.showPopup(params, callback)
	}

	const hapticFeedback = (
		type: 'impact' | 'notification' | 'selection',
		style?: 'light' | 'medium' | 'heavy' | 'error' | 'success' | 'warning'
	) => {
		if (type === 'impact') {
			webApp.value?.HapticFeedback?.impactOccurred(style as any)
		} else if (type === 'notification') {
			webApp.value?.HapticFeedback?.notificationOccurred(style as any)
		} else if (type === 'selection') {
			webApp.value?.HapticFeedback?.selectionChanged()
		}
	}

	const setHeaderColor = (color: string) => {
		webApp.value?.setHeaderColor(color)
	}

	const setBackgroundColor = (color: string) => {
		webApp.value?.setBackgroundColor(color)
	}

	const enableClosingConfirmation = () => {
		webApp.value?.enableClosingConfirmation()
	}

	const disableClosingConfirmation = () => {
		webApp.value?.disableClosingConfirmation()
	}

	// Main Button
	const showMainButton = (text: string, callback?: () => void) => {
		if (!webApp.value?.MainButton) return

		webApp.value.MainButton.text = text
		webApp.value.MainButton.show()

		if (callback) {
			webApp.value.MainButton.onClick(callback)
		}
	}

	const hideMainButton = () => {
		webApp.value?.MainButton?.hide()
	}

	const setMainButtonText = (text: string) => {
		if (webApp.value?.MainButton) {
			webApp.value.MainButton.text = text
		}
	}

	const enableMainButton = () => {
		webApp.value?.MainButton?.enable()
	}

	const disableMainButton = () => {
		webApp.value?.MainButton?.disable()
	}

	// Back Button
	const showBackButton = (callback?: () => void) => {
		if (!webApp.value?.BackButton) return

		webApp.value.BackButton.show()

		if (callback) {
			webApp.value.BackButton.onClick(callback)
		}
	}

	const hideBackButton = () => {
		webApp.value?.BackButton?.hide()
	}

	return {
		// State
		isAvailable,
		webApp,
		user,
		initData,
		initDataUnsafe,
		themeParams,
		colorScheme,
		platform,
		version,
		isExpanded,
		viewportHeight,
		viewportStableHeight,

		// Methods
		ready,
		expand,
		close,
		showAlert,
		showConfirm,
		showPopup,
		hapticFeedback,
		setHeaderColor,
		setBackgroundColor,
		enableClosingConfirmation,
		disableClosingConfirmation,

		// Main Button
		showMainButton,
		hideMainButton,
		setMainButtonText,
		enableMainButton,
		disableMainButton,

		// Back Button
		showBackButton,
		hideBackButton
	}
}
