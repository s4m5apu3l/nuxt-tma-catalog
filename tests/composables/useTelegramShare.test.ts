import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTelegramShare } from '~/composables/useTelegramShare'

// Mock window.open
const mockWindowOpen = vi.fn()
Object.defineProperty(window, 'open', {
	value: mockWindowOpen,
	writable: true
})

describe('useTelegramShare', () => {
	let telegramShare: ReturnType<typeof useTelegramShare>

	beforeEach(() => {
		telegramShare = useTelegramShare()
		mockWindowOpen.mockClear()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('validateShareUrl', () => {
		it('should validate valid HTTP URLs', () => {
			expect(telegramShare.validateShareUrl('http://example.com')).toBe(true)
		})

		it('should validate valid HTTPS URLs', () => {
			expect(telegramShare.validateShareUrl('https://example.com')).toBe(true)
		})

		it('should reject invalid URLs', () => {
			expect(telegramShare.validateShareUrl('not-a-url')).toBe(false)
			expect(telegramShare.validateShareUrl('ftp://example.com')).toBe(false)
			expect(telegramShare.validateShareUrl('')).toBe(false)
		})
	})

	describe('validateShareText', () => {
		it('should validate non-empty text', () => {
			expect(telegramShare.validateShareText('Valid text')).toBe(true)
		})

		it('should reject empty or whitespace-only text', () => {
			expect(telegramShare.validateShareText('')).toBe(false)
			expect(telegramShare.validateShareText('   ')).toBe(false)
		})

		it('should reject text longer than 4096 characters', () => {
			const longText = 'a'.repeat(4097)
			expect(telegramShare.validateShareText(longText)).toBe(false)
		})

		it('should accept text exactly 4096 characters', () => {
			const maxText = 'a'.repeat(4096)
			expect(telegramShare.validateShareText(maxText)).toBe(true)
		})
	})

	describe('generateTelegramShareUrl', () => {
		it('should generate valid Telegram share URL', () => {
			const options = {
				url: 'https://example.com/product/123',
				text: 'Check out this product!'
			}

			const result = telegramShare.generateTelegramShareUrl(options)

			expect(result).toBe(
				'https://t.me/share/url?url=https%3A%2F%2Fexample.com%2Fproduct%2F123&text=Check%20out%20this%20product%21'
			)
		})

		it('should return null for invalid URL', () => {
			const options = {
				url: 'invalid-url',
				text: 'Valid text'
			}

			const result = telegramShare.generateTelegramShareUrl(options)

			expect(result).toBeNull()
			expect(telegramShare.error.value).toBe('Invalid URL provided for sharing')
		})

		it('should return null for invalid text', () => {
			const options = {
				url: 'https://example.com',
				text: ''
			}

			const result = telegramShare.generateTelegramShareUrl(options)

			expect(result).toBeNull()
			expect(telegramShare.error.value).toBe('Share text is required and must be less than 4096 characters')
		})
	})

	describe('shareOnTelegram', () => {
		it('should successfully open Telegram share URL', async () => {
			const mockWindow = {}
			mockWindowOpen.mockReturnValue(mockWindow)

			const options = {
				url: 'https://example.com/product/123',
				text: 'Check out this product!'
			}

			const result = await telegramShare.shareOnTelegram(options)

			expect(result).toBe(true)
			expect(mockWindowOpen).toHaveBeenCalledWith(
				'https://t.me/share/url?url=https%3A%2F%2Fexample.com%2Fproduct%2F123&text=Check%20out%20this%20product%21',
				'_blank',
				'noopener,noreferrer'
			)
			expect(telegramShare.error.value).toBeNull()
		})

		it('should handle popup blocker', async () => {
			mockWindowOpen.mockReturnValue(null)

			const options = {
				url: 'https://example.com/product/123',
				text: 'Check out this product!'
			}

			const result = await telegramShare.shareOnTelegram(options)

			expect(result).toBe(false)
			expect(telegramShare.error.value).toBe(
				'Failed to open share window. Please check your popup blocker settings.'
			)
		})

		it('should handle invalid share options', async () => {
			const options = {
				url: 'invalid-url',
				text: 'Valid text'
			}

			const result = await telegramShare.shareOnTelegram(options)

			expect(result).toBe(false)
			expect(mockWindowOpen).not.toHaveBeenCalled()
		})
	})

	describe('shareProduct', () => {
		it('should format and share product correctly', async () => {
			const mockWindow = {}
			mockWindowOpen.mockReturnValue(mockWindow)

			const product = {
				title: 'Test Product',
				price: 1500,
				description: 'This is a test product description'
			}
			const productUrl = 'https://example.com/product/123'

			const result = await telegramShare.shareProduct(product, productUrl)

			expect(result).toBe(true)
			expect(mockWindowOpen).toHaveBeenCalledWith(
				expect.stringContaining('https://t.me/share/url'),
				'_blank',
				'noopener,noreferrer'
			)

			// Check that the URL contains the formatted price and product info
			const calledUrl = mockWindowOpen.mock.calls[0][0]
			expect(calledUrl).toContain(encodeURIComponent('Test Product'))
			expect(calledUrl).toContain(encodeURIComponent('1 500,00 ₽'))
			expect(calledUrl).toContain(encodeURIComponent('This is a test product description'))
		})

		it('should handle product without description', async () => {
			const mockWindow = {}
			mockWindowOpen.mockReturnValue(mockWindow)

			const product = {
				title: 'Test Product',
				price: 1500
			}
			const productUrl = 'https://example.com/product/123'

			const result = await telegramShare.shareProduct(product, productUrl)

			expect(result).toBe(true)

			const calledUrl = mockWindowOpen.mock.calls[0][0]
			expect(calledUrl).toContain(encodeURIComponent('Test Product'))
			expect(calledUrl).toContain(encodeURIComponent('1 500,00 ₽'))
		})

		it('should truncate long descriptions', async () => {
			const mockWindow = {}
			mockWindowOpen.mockReturnValue(mockWindow)

			const longDescription = 'a'.repeat(250)
			const product = {
				title: 'Test Product',
				price: 1500,
				description: longDescription
			}
			const productUrl = 'https://example.com/product/123'

			const result = await telegramShare.shareProduct(product, productUrl)

			expect(result).toBe(true)

			const calledUrl = mockWindowOpen.mock.calls[0][0]
			const decodedUrl = decodeURIComponent(calledUrl)
			expect(decodedUrl).toContain('a'.repeat(200) + '...')
		})
	})

	describe('isTelegramWebApp', () => {
		it('should return false when Telegram WebApp is not available', () => {
			expect(telegramShare.isTelegramWebApp()).toBe(false)
		})

		it('should return true when Telegram WebApp is available', () => {
			// Mock Telegram WebApp
			;(window as any).Telegram = {
				WebApp: {}
			}

			expect(telegramShare.isTelegramWebApp()).toBe(true)

			// Clean up
			delete (window as any).Telegram
		})
	})

	describe('clearError', () => {
		it('should clear error state', () => {
			// Set an error first
			telegramShare.generateTelegramShareUrl({
				url: 'invalid-url',
				text: 'Valid text'
			})

			expect(telegramShare.error.value).toBeTruthy()

			telegramShare.clearError()

			expect(telegramShare.error.value).toBeNull()
		})
	})
})
