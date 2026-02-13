# Image Compression

## Overview

The application automatically compresses images before uploading them to Appwrite storage. This reduces bandwidth usage, speeds up uploads, and saves storage space.

## Features

- **Automatic compression**: All images are compressed by default before upload
- **WebP conversion**: Images are converted to WebP format for better compression
- **Quality preservation**: Uses 85% quality to balance file size and visual quality
- **Resolution limiting**: Maximum dimensions of 1920x1920px while maintaining aspect ratio
- **Progress tracking**: Shows compression and upload progress to users

## Configuration

Default compression settings in `app/utils/imageCompression.ts`:

```typescript
{
  maxWidth: 1920,      // Maximum width in pixels
  maxHeight: 1920,     // Maximum height in pixels
  quality: 0.85,       // Quality (0.0 - 1.0)
  mimeType: 'image/webp' // Output format
}
```

## Usage

### In Components

The compression is handled automatically by the `useImages` composable:

```typescript
const { uploadImage } = useImages()

// Compress and upload (default behavior)
const fileId = await uploadImage(file)

// Skip compression (if needed)
const fileId = await uploadImage(file, false)
```

### Compression Stats

In development mode, compression statistics are logged to console:

```typescript
{
  originalSize: 5242880,        // Original file size in bytes
  compressedSize: 1048576,      // Compressed file size in bytes
  savedBytes: 4194304,          // Bytes saved
  savedPercent: 80,             // Percentage saved
  originalSizeMB: "5.00",       // Original size in MB
  compressedSizeMB: "1.00"      // Compressed size in MB
}
```

## Benefits

1. **Faster uploads**: Smaller files upload faster, especially on mobile networks
2. **Storage savings**: Reduces Appwrite storage usage by 60-80% on average
3. **Better performance**: Smaller images load faster for end users
4. **Cost reduction**: Lower bandwidth and storage costs
5. **Mobile-friendly**: Optimized for Telegram Mini App users on mobile devices

## Technical Details

### Compression Process

1. File is read as Data URL
2. Image is loaded into HTML5 Canvas
3. Canvas is resized if dimensions exceed limits
4. Image is drawn with high-quality smoothing
5. Canvas is converted to WebP blob with specified quality
6. New File object is created from blob
7. Compressed file is uploaded to Appwrite

### Browser Compatibility

- Requires HTML5 Canvas support (all modern browsers)
- WebP support (all modern browsers, fallback to original format if needed)
- FileReader API (all modern browsers)

### Error Handling

If compression fails, the original file is uploaded instead to ensure upload reliability.

## Customization

To adjust compression settings for specific use cases:

```typescript
import { compressImage } from '~/utils/imageCompression'

// Custom compression for thumbnails
const thumbnail = await compressImage(file, {
	maxWidth: 400,
	maxHeight: 400,
	quality: 0.7,
	mimeType: 'image/webp'
})

// High-quality compression
const highQuality = await compressImage(file, {
	maxWidth: 2560,
	maxHeight: 2560,
	quality: 0.95,
	mimeType: 'image/webp'
})
```

## Disabling Compression

To disable compression globally, set `compressionEnabled` to `false` in the `useImages` composable:

```typescript
const { compressionEnabled } = useImages()
compressionEnabled.value = false
```
