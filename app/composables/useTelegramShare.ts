interface TelegramShareOptions {
	url: string
	text: string
}

interface TelegramShareState {
	isSharing: boolean
	error: string | null
}

export const useTelegramShare = () => {
	// Reactive state
	const state = reactive<TelegramShareState>({
		isSharing: false,
		error: null
	})

	// Clear error state
	const clearError = () => {
		state.error = null
	}

	// Set error state
	const setError = (error: string) => {
		state.error = error
	}

	// Validate share URL
	const validateShareUrl = (url: string): boolean => {
		try {
			const urlObj = new URL(url)
			return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
		} catch {
			return false
		}
	}

	// Validate share text
	const validateShareText = (text: string): boolean => {
		return text.trim().length > 0 && text.length <= 4096 // Telegram message limit
	}

	// Generate Telegram share URL
	const generateTelegramShareUrl = (options: TelegramShareOptions): string | null => {
		try {
			clearError()

			// Validate inputs
			if (!validateShareUrl(options.url)) {
				setError('Invalid URL provided for sharing')
				return null
			}

			if (!validateShareText(options.text)) {
				setError('Share text is required and must be less than 4096 characters')
				return null
			}

			// Create Telegram share URL
			const telegramBaseUrl = 'https://t.me/share/url'
			const params = new URLSearchParams({
				url: options.url,
				text: options.text
			})

			return `${telegramBaseUrl}?${params.toString()}`
		} catch (error: any) {
			console.error('Generate Telegram share URL error:', error)
			setError('Failed to generate share URL')
			return null
		}
	}

	// Share via Telegram
	const shareOnTelegram = async (options: TelegramShareOptions): Promise<boolean> => {
		try {
			state.isSharing = true
			clearError()

			// Generate share URL
			const shareUrl = generateTelegramShareUrl(options)
			if (!shareUrl) {
				return false
			}

			// Check if we're in a browser environment
			if (typeof window === 'undefined') {
				setError('Sharing is only available in browser environment')
				return false
			}

			// Open Telegram share URL
			const shareWindow = window.open(shareUrl, '_blank', 'noopener,noreferrer')

			if (!shareWindow) {
				setError('Failed to open share window. Please check your popup blocker settings.')
				return false
			}

			return true
		} catch (error: any) {
			console.error('Share on Telegram error:', error)
			setError('Failed to share on Telegram. Please try again.')
			return false
		} finally {
			state.isSharing = false
		}
	}

	// Share product on Telegram
	const shareProduct = async (
		product: {
			title: string
			price: number
			description?: string
		},
		productUrl: string
	): Promise<boolean> => {
		try {
			// Format price
			const formattedPrice = new Intl.NumberFormat('ru-RU', {
				style: 'currency',
				currency: 'RUB'
			}).format(product.price)

			// Create share text
			let shareText = `${product.title} - ${formattedPrice}`

			if (product.description && product.description.trim().length > 0) {
				// Add description but limit total length
				const maxDescLength = 200
				const description =
					product.description.length > maxDescLength
						? `${product.description.substring(0, maxDescLength)}...`
						: product.description

				shareText += `\n\n${description}`
			}

			// Share via Telegram
			return await shareOnTelegram({
				url: productUrl,
				text: shareText
			})
		} catch (error: any) {
			console.error('Share product error:', error)
			setError('Failed to share product. Please try again.')
			return false
		}
	}

	// Check if Telegram Web App is available
	const isTelegramWebApp = (): boolean => {
		return (
			typeof window !== 'undefined' &&
			typeof (window as any).Telegram !== 'undefined' &&
			typeof (window as any).Telegram.WebApp !== 'undefined'
		)
	}

	// Share via Telegram Web App (if available)
	const shareViaTelegramWebApp = async (options: TelegramShareOptions): Promise<boolean> => {
		try {
			if (!isTelegramWebApp()) {
				// Fallback to regular sharing
				return await shareOnTelegram(options)
			}

			const webApp = (window as any).Telegram.WebApp

			// Use Telegram Web App sharing if available
			if (webApp.shareToStory) {
				webApp.shareToStory(options.url, {
					text: options.text
				})
				return true
			} else {
				// Fallback to regular sharing
				return await shareOnTelegram(options)
			}
		} catch (error: any) {
			console.error('Share via Telegram Web App error:', error)
			// Fallback to regular sharing
			return await shareOnTelegram(options)
		}
	}

	return {
		// State (readonly)
		isSharing: readonly(toRef(state, 'isSharing')),
		error: readonly(toRef(state, 'error')),

		// Actions
		shareOnTelegram,
		shareProduct,
		shareViaTelegramWebApp,
		generateTelegramShareUrl,
		clearError,

		// Utilities
		isTelegramWebApp,
		validateShareUrl,
		validateShareText
	}
}
