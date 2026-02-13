import { useMiniApp, useBackButton, useTheme, usePopup, useViewport } from 'vue-tg/latest'

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
		miniApp.isClosingConfirmationEnabled.value = true
	}

	const showBackButton = (onClick: () => void) => {
		backButton.show()
		backButton.onClick(onClick)
	}

	const hideBackButton = () => {
		backButton.hide()
	}

	const openTelegramLink = (url: string) => {
		miniApp.openTelegramLink(url)
	}

	const openLink = (url: string, options?: { try_instant_view: boolean }) => {
		miniApp.openLink(url, options)
	}

	const showAlert = (message: string) => {
		popup.showAlert(message)
	}

	const showConfirm = (message: string): Promise<boolean> => {
		return popup.showConfirm(message)
	}

	const showPopup = (params: {
		title?: string
		message: string
		buttons: Array<{ id?: string; type?: 'close' | 'default' | 'ok' | 'cancel' | 'destructive'; text: string }>
	}): Promise<string | null> => {
		return popup.showPopup(params)
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
