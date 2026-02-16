import { useMiniApp, useTheme, usePopup, useViewport } from 'vue-tg'

export const useTelegram = () => {
	const miniApp = useMiniApp()
	const theme = useTheme()
	const popup = usePopup()
	const viewport = useViewport()

	const user = computed(() => miniApp.initDataUnsafe?.user)
	const isReady = computed(() => miniApp.isReady)
	const themeParams = computed(() => theme.themeParams)

	// Check if running inside Telegram WebApp
	const isTelegramWebApp = computed(() => {
		if (!import.meta.client) return false

		// Check if Telegram WebApp object exists and has initData
		const tg = (window as any).Telegram?.WebApp
		if (!tg) return false

		// Check for valid initData or platform
		return !!(tg.initData || tg.platform !== 'unknown')
	})

	const init = () => {
		miniApp.ready()
		viewport.expand()
	}

	const openTelegramLink = (url: string) => {
		miniApp.openTelegramLink(url)
	}

	const openLink = (url: string, options?: { try_instant_view: boolean }) => {
		miniApp.openLink(url, options)
	}

	const showAlert = (message: string) => {
		if (popup.showAlert) {
			popup.showAlert(message)
		}
	}

	const showConfirm = (message: string): Promise<boolean> => {
		if (popup.showConfirm) {
			return popup.showConfirm(message)
		}
		return Promise.resolve(false)
	}

	const showPopup = (params: {
		title?: string
		message: string
		buttons: Array<{ id?: string; type?: 'close' | 'default' | 'ok' | 'cancel' | 'destructive'; text: string }>
	}): Promise<string | null> => {
		if (popup.showPopup) {
			return popup.showPopup(params as any)
		}
		return Promise.resolve(null)
	}

	const openChat = (username: string): void => {
		const cleanUsername = username.replace('@', '')
		miniApp.openTelegramLink(`https://t.me/${cleanUsername}`)
	}

	const close = () => {
		miniApp.close()
	}

	onMounted(() => {
		init()
	})

	return {
		user: readonly(user),
		themeParams: readonly(themeParams),
		isReady: readonly(isReady),
		isTelegramWebApp: readonly(isTelegramWebApp),
		init,
		openTelegramLink,
		openLink,
		showAlert,
		showConfirm,
		showPopup,
		openChat,
		close
	}
}
