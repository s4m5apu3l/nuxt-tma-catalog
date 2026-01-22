import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useTelegramShare } from '~/composables/useTelegramShare'

// Mock window.open for integration testing
const mockWindowOpen = vi.fn()
Object.defineProperty(window, 'open', {
	value: mockWindowOpen,
	writable: true
})

describe('Telegram Share Integration', () => {
	beforeEach(() => {
		mockWindowOpen.mockClear()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should generate valid Telegram share URLs with product data', async () => {
		const { shareProduct } = useTelegramShare()

		// Mock successful window.open
		const mockWindow = {}
		mockWindowOpen.mockReturnValue(mockWindow)

		const testProduct = {
			title: 'Test Product',
			price: 1500.5,
			description: 'This is a test product with a detailed description'
		}
		const testUrl = 'https://example.com/product/123'

		const result = await shareProduct(testProduct, testUrl)

		expect(result).toBe(true)
		expect(mockWindowOpen).toHaveBeenCalledTimes(1)

		const [calledUrl, target, features] = mockWindowOpen.mock.calls[0]

		// Verify the URL structure
		expect(calledUrl).toContain('https://t.me/share/url')
		expect(calledUrl).toContain('url=' + encodeURIComponent(testUrl))
		expect(calledUrl).toContain(encodeURIComponent('Test Product'))
		expect(calledUrl).toContain(encodeURIComponent('1 500,50 ₽'))
		expect(calledUrl).toContain(encodeURIComponent('This is a test product with a detailed description'))

		// Verify window.open parameters
		expect(target).toBe('_blank')
		expect(features).toBe('noopener,noreferrer')
	})

	it('should handle products with long descriptions by truncating', async () => {
		const { shareProduct } = useTelegramShare()

		const mockWindow = {}
		mockWindowOpen.mockReturnValue(mockWindow)

		const longDescription = 'a'.repeat(250) // Longer than 200 char limit
		const testProduct = {
			title: 'Product with Long Description',
			price: 999.99,
			description: longDescription
		}
		const testUrl = 'https://example.com/product/456'

		const result = await shareProduct(testProduct, testUrl)

		expect(result).toBe(true)

		const calledUrl = mockWindowOpen.mock.calls[0][0]
		const decodedUrl = decodeURIComponent(calledUrl)

		// Should contain truncated description with ellipsis
		expect(decodedUrl).toContain('a'.repeat(200) + '...')
		expect(decodedUrl).not.toContain('a'.repeat(250))
	})

	it('should handle products without descriptions', async () => {
		const { shareProduct } = useTelegramShare()

		const mockWindow = {}
		mockWindowOpen.mockReturnValue(mockWindow)

		const testProduct = {
			title: 'Simple Product',
			price: 50.0
		}
		const testUrl = 'https://example.com/product/789'

		const result = await shareProduct(testProduct, testUrl)

		expect(result).toBe(true)

		const calledUrl = mockWindowOpen.mock.calls[0][0]
		const decodedUrl = decodeURIComponent(calledUrl)

		// Should only contain title and price
		expect(decodedUrl).toContain('Simple Product - 50,00 ₽')
		expect(decodedUrl).not.toContain('\n\n') // No description separator
	})

	it('should handle popup blocker scenarios', async () => {
		const { shareProduct, error } = useTelegramShare()

		// Mock popup blocker (window.open returns null)
		mockWindowOpen.mockReturnValue(null)

		const testProduct = {
			title: 'Blocked Product',
			price: 100.0
		}
		const testUrl = 'https://example.com/product/blocked'

		const result = await shareProduct(testProduct, testUrl)

		expect(result).toBe(false)
		expect(error.value).toBe('Failed to open share window. Please check your popup blocker settings.')
	})

	it('should validate share URLs correctly', () => {
		const { validateShareUrl } = useTelegramShare()

		// Valid URLs
		expect(validateShareUrl('https://example.com')).toBe(true)
		expect(validateShareUrl('http://localhost:3000')).toBe(true)
		expect(validateShareUrl('https://example.com/path?query=value')).toBe(true)

		// Invalid URLs
		expect(validateShareUrl('not-a-url')).toBe(false)
		expect(validateShareUrl('ftp://example.com')).toBe(false)
		expect(validateShareUrl('')).toBe(false)
		expect(validateShareUrl('javascript:alert(1)')).toBe(false)
	})

	it('should validate share text correctly', () => {
		const { validateShareText } = useTelegramShare()

		// Valid text
		expect(validateShareText('Valid share text')).toBe(true)
		expect(validateShareText('a'.repeat(4096))).toBe(true) // Max length

		// Invalid text
		expect(validateShareText('')).toBe(false)
		expect(validateShareText('   ')).toBe(false) // Whitespace only
		expect(validateShareText('a'.repeat(4097))).toBe(false) // Too long
	})

	it('should detect Telegram Web App environment', () => {
		const { isTelegramWebApp } = useTelegramShare()

		// Initially should be false
		expect(isTelegramWebApp()).toBe(false)

		// Mock Telegram Web App
		;(window as any).Telegram = {
			WebApp: {
				version: '6.0'
			}
		}

		expect(isTelegramWebApp()).toBe(true)

		// Clean up
		delete (window as any).Telegram
		expect(isTelegramWebApp()).toBe(false)
	})

	it('should clear errors correctly', () => {
		const { generateTelegramShareUrl, error, clearError } = useTelegramShare()

		// Generate an error
		generateTelegramShareUrl({
			url: 'invalid-url',
			text: 'Valid text'
		})

		expect(error.value).toBeTruthy()

		// Clear the error
		clearError()

		expect(error.value).toBeNull()
	})

	it('should handle special characters in product data', async () => {
		const { shareProduct } = useTelegramShare()

		const mockWindow = {}
		mockWindowOpen.mockReturnValue(mockWindow)

		const testProduct = {
			title: 'Product with "quotes" & symbols!',
			price: 1234.56,
			description: 'Description with émojis 🎉 and special chars: @#$%'
		}
		const testUrl = 'https://example.com/product/special'

		const result = await shareProduct(testProduct, testUrl)

		expect(result).toBe(true)

		const calledUrl = mockWindowOpen.mock.calls[0][0]

		// URL should be properly encoded
		expect(calledUrl).toContain('https://t.me/share/url')
		expect(calledUrl).toContain(encodeURIComponent('Product with "quotes" & symbols!'))
		expect(calledUrl).toContain(encodeURIComponent('Description with émojis 🎉 and special chars: @#$%'))
	})
})
