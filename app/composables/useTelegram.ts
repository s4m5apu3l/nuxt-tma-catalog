import { useMiniApp, useBackButton, useTheme, usePopup, useViewport } from 'vue-tg'

export const useTelegram = () => {
	const miniApp = useMiniApp()
	const backButton = useBackButton()
	const theme = useTheme()
	const popup = usePopup()
	const viewport = useViewport()

	const user = computed(() => miniApp.initDataUnsafe?.user)
	const isReady = computed(() => miniApp.isReady)
	const themeParams = computed(() => theme.themeParams)

	const init = () => {
		miniApp.ready()
		viewport.expand()
		// miniApp.ClosingConfirmation()
	}

	const showBackButton = (onClick: () => void) => {
		if (backButton.show && backButton.onClick) {
			backButton.show()
			backButton.onClick(onClick)
		}
	}

	const hideBackButton = () => {
		if (backButton.hide) {
			backButton.hide()
		}
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
