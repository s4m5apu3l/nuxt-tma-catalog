# Telegram Sharing Functionality

## Overview

The TMA Catalog includes Telegram sharing functionality that allows users to share product information directly to Telegram chats, channels, or stories. This feature is implemented using the Telegram Web Share API and provides a seamless sharing experience.

## Features

- **Product Sharing**: Share product title, price, and description
- **URL Validation**: Ensures only valid HTTP/HTTPS URLs are shared
- **Text Validation**: Validates share text length (max 4096 characters)
- **Description Truncation**: Automatically truncates long descriptions to 200 characters
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during sharing process
- **Telegram Web App Support**: Enhanced integration when running in Telegram Web App

## Implementation

### Composable: `useTelegramShare`

The sharing functionality is implemented as a Vue composable located at `app/composables/useTelegramShare.ts`.

#### Key Methods

- `shareProduct(product, productUrl)`: Share a product with formatted text
- `shareOnTelegram(options)`: Generic sharing method
- `generateTelegramShareUrl(options)`: Generate Telegram share URL
- `validateShareUrl(url)`: Validate share URL
- `validateShareText(text)`: Validate share text
- `isTelegramWebApp()`: Check if running in Telegram Web App

#### Usage Example

```typescript
const {
  shareProduct,
  isSharing,
  error,
  clearError
} = useTelegramShare()

// Share a product
const success = await shareProduct(
  {
    title: 'Product Name',
    price: 1500.50,
    description: 'Product description'
  },
  'https://example.com/product/123'
)
```

### Product Detail Page Integration

The product detail page (`app/pages/product/[id].vue`) includes:

- Telegram share button with loading state
- Error display for sharing failures
- Automatic product data formatting
- Responsive design for mobile and desktop

### Share URL Format

Generated Telegram share URLs follow this format:
```
https://t.me/share/url?url={encoded_product_url}&text={encoded_share_text}
```

### Share Text Format

The share text includes:
1. Product title and formatted price
2. Product description (truncated if > 200 characters)

Example:
```
Product Name - 1 500,50 ₽

This is the product description that provides details about the item.
```

## Validation Rules

### URL Validation
- Must be valid HTTP or HTTPS URL
- Rejects other protocols (ftp, javascript, etc.)
- Rejects empty or malformed URLs

### Text Validation
- Must not be empty or whitespace-only
- Maximum length: 4096 characters (Telegram limit)
- Automatically truncates descriptions to fit within limits

## Error Handling

The implementation includes comprehensive error handling:

- **Invalid URLs**: Clear error messages for malformed URLs
- **Popup Blockers**: Detects and handles popup blocker scenarios
- **Network Issues**: Graceful handling of network-related failures
- **Validation Errors**: User-friendly validation error messages

## Testing

### Unit Tests
Located at `tests/composables/useTelegramShare.test.ts`
- Tests all validation functions
- Tests URL generation
- Tests error scenarios
- Tests product sharing logic

### Integration Tests
Located at `tests/integration/telegram-share.test.ts`
- End-to-end sharing flow tests
- Special character handling
- Description truncation
- Popup blocker scenarios

### Manual Testing
Manual test page at `tests/manual/telegram-share-test.html`
- Interactive testing interface
- Real Telegram integration testing
- Visual validation of generated URLs

## Browser Compatibility

The sharing functionality works in all modern browsers that support:
- `window.open()` method
- `URL` constructor
- `URLSearchParams` API
- ES6+ features

## Security Considerations

- All URLs are validated before sharing
- Share text is properly encoded to prevent XSS
- External links open with `noopener,noreferrer` attributes
- No sensitive data is included in share URLs

## Internationalization

The sharing functionality supports:
- Russian and English UI text
- Localized price formatting (Russian Ruble)
- Proper encoding of international characters and emojis

## Future Enhancements

Potential improvements for future versions:
- Telegram Bot API integration for enhanced sharing
- Custom share templates
- Analytics tracking for shared links
- Social media preview optimization