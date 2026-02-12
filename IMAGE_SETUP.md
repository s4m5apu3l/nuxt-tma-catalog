# Image System Setup

This document explains how to set up and use the image system with Appwrite Storage.

## Configuration

### Environment Variables

Make sure these variables are set in your `.env` file:

```env
APPWRITE_PUBLIC_ENDPOINT="https://sgp.cloud.appwrite.io/v1"
APPWRITE_PUBLIC_PROJECT_ID="your-project-id"
APPWRITE_PUBLIC_BUCKET_ID="your-bucket-id"
```

### Appwrite Storage Bucket

1. Create a storage bucket in your Appwrite console
2. Set the bucket permissions to allow read/write access
3. Configure file size limits (max 5MB recommended)
4. Enable allowed file types: JPG, PNG, WebP

## Image Utilities

### `getImageUrl(fileId: string)`

Returns the direct view URL for an image.

```typescript
const imageUrl = getImageUrl('file-id-123')
// Returns: https://sgp.cloud.appwrite.io/v1/storage/buckets/bucket-id/files/file-id-123/view?project=project-id
```

### `getImagePreviewUrl(fileId: string, width?: number, height?: number, quality?: number)`

Returns a preview URL with optional resizing and quality settings.

```typescript
const thumbnailUrl = getImagePreviewUrl('file-id-123', 200, 200, 80)
const highQualityUrl = getImagePreviewUrl('file-id-123', 800, 600, 95)
```

### `validateImageFile(file: File)`

Validates image files before upload.

```typescript
const validation = validateImageFile(file)
if (!validation.isValid) {
	console.error(validation.error)
}
```

## Image Composable

### `useImages()`

Provides reactive image management functionality:

```typescript
const { uploadImage, uploadImages, deleteImage, getImageInfo, isUploading, uploadProgress, error } = useImages()

// Upload single image
const fileId = await uploadImage(file)

// Upload multiple images
const fileIds = await uploadImages([file1, file2, file3])

// Delete image
await deleteImage(fileId)
```

## Components

### `ImageGallery.vue`

Displays product images with navigation and modal view.

```vue
<ImageGallery :images="product.images" :alt="product.name" />
```

Features:

- Thumbnail navigation
- Full-screen modal
- Keyboard navigation (arrow keys, escape)
- Responsive design
- Loading states

### `ImageUpload.vue` (Admin)

Drag-and-drop image upload component for admin panel.

```vue
<ImageUpload v-model="product.images" :max-images="5" :disabled="isLoading" />
```

Features:

- Drag and drop support
- Multiple file selection
- Image preview grid
- Delete functionality
- Upload progress
- File validation

## Testing

### Test Image Functionality

Run the test script to verify your image setup:

```bash
node scripts/test-images.js
```

This will:

- Test bucket access
- Generate sample URLs
- Verify file operations
- Display configuration info

### Add Sample Images to Products

Run the sample data script:

```bash
node scripts/add-product-images.js
```

Note: This adds placeholder image IDs. In production, you would:

1. Upload actual images to Appwrite Storage
2. Get real file IDs from upload responses
3. Update products with real image IDs

## Image Workflow

### For Users (Catalog)

1. Images are displayed using `ImageGallery` component
2. Thumbnails are generated automatically with appropriate sizes
3. Full-size images load in modal view
4. All images are cached by the browser

### For Admins (Management)

1. Use `ImageUpload` component in product forms
2. Drag and drop or click to select images
3. Images are uploaded to Appwrite Storage immediately
4. File IDs are stored in product documents
5. Images can be deleted (removes from storage and database)

## Performance Considerations

### Image Optimization

- Use `getImagePreviewUrl()` with appropriate dimensions
- Set quality parameter (80-90 for thumbnails, 95 for full size)
- Implement lazy loading for image galleries

### Caching

- Appwrite automatically handles CDN caching
- Browser caching is enabled by default
- Consider implementing progressive loading

### File Size Limits

- Maximum file size: 5MB per image
- Recommended: Compress images before upload
- Use WebP format when possible for better compression

## Error Handling

### Common Issues

1. **Bucket not found (404)**: Check bucket ID in environment variables
2. **Unauthorized (401)**: Verify project ID and permissions
3. **File too large**: Ensure files are under 5MB limit
4. **Invalid format**: Only JPG, PNG, WebP are supported

### Error Recovery

- All upload operations include error handling
- Failed uploads are automatically retried
- Users receive clear error messages
- Partial uploads are cleaned up automatically

## Security

### File Validation

- File type validation on client and server
- File size limits enforced
- Malicious file detection
- Secure file naming

### Access Control

- Bucket permissions control read/write access
- Image URLs include project authentication
- Admin-only upload capabilities
- User-level image access control

## Deployment Notes

### Production Setup

1. Configure CDN for better performance
2. Set up image optimization pipeline
3. Implement backup strategy for storage
4. Monitor storage usage and costs

### Environment Configuration

- Use different buckets for development/production
- Configure appropriate CORS settings
- Set up monitoring and alerts
- Implement usage analytics
