// Telegram WebApp types
declare global {
	interface Window {
		Telegram?: {
			WebApp: {
				ready(): void
				expand(): void
				close(): void
				enableClosingConfirmation(): void
				disableClosingConfirmation(): void
				openTelegramLink(url: string): void
				openLink(url: string, options?: { try_instant_view?: boolean }): void
				showAlert(message: string): void
				showConfirm(message: string, callback: (confirmed: boolean) => void): void
				initDataUnsafe?: {
					user?: {
						id: number
						first_name: string
						last_name?: string
						username?: string
						language_code?: string
						is_premium?: boolean
					}
				}
				themeParams?: {
					bg_color?: string
					text_color?: string
					hint_color?: string
					link_color?: string
					button_color?: string
					button_text_color?: string
					secondary_bg_color?: string
				}
			}
		}
	}
}

export {}
