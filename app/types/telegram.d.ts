declare global {
	interface Window {
		Telegram?: {
			WebApp: {
				initData: string
				initDataUnsafe: {
					user?: {
						id: number
						first_name: string
						last_name?: string
						username?: string
						language_code?: string
						is_premium?: boolean
						photo_url?: string
					}
					chat_instance?: string
					chat_type?: string
					auth_date: number
					hash: string
					query_id?: string
					start_param?: string
				}
				themeParams: Record<string, any>
				colorScheme: 'light' | 'dark'
				platform: string
				version: string
				isExpanded: boolean
				viewportHeight: number
				viewportStableHeight: number
				MainButton: {
					text: string
					color: string
					textColor: string
					isVisible: boolean
					isActive: boolean
					isProgressVisible: boolean
					setText: (text: string) => void
					onClick: (callback: () => void) => void
					offClick: (callback: () => void) => void
					show: () => void
					hide: () => void
					enable: () => void
					disable: () => void
					showProgress: (leaveActive?: boolean) => void
					hideProgress: () => void
					setParams: (params: Record<string, any>) => void
				}
				BackButton: {
					isVisible: boolean
					onClick: (callback: () => void) => void
					offClick: (callback: () => void) => void
					show: () => void
					hide: () => void
				}
				HapticFeedback: {
					impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
					notificationOccurred: (type: 'error' | 'success' | 'warning') => void
					selectionChanged: () => void
				}
				ready: () => void
				expand: () => void
				close: () => void
				showAlert: (message: string, callback?: () => void) => void
				showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
				showPopup: (params: any, callback?: (buttonId: string) => void) => void
				setHeaderColor: (color: string) => void
				setBackgroundColor: (color: string) => void
				enableClosingConfirmation: () => void
				disableClosingConfirmation: () => void
			}
		}
	}
}

export {}