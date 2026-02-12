# TMA Catalog Development Skills

## Quick Component Creation

### New Admin CRUD Page

When creating a new admin CRUD page (e.g., for Products, Orders):

1. Create page structure:

```
app/pages/admin/{entity}/
├── index.vue          # List view
├── create.vue         # Create form
└── [id].vue          # Edit form
```

2. Create composable `app/composables/use{Entity}.ts`:

```typescript
export const use{Entity} = () => {
  const items = ref<{Entity}[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetch{Entity} = async (): Promise<{Entity}[]> => {
    const { databases } = useAppwrite()
    const config = useRuntimeConfig()
    const response = await databases.listDocuments(
      config.public.appwriteBdKey,
      config.public.appwriteCollection{Entity},
      [Query.orderDesc('$createdAt')]
    )
    items.value = response.documents as {Entity}[]
    return items.value
  }

  const create{Entity} = async (data: Create{Entity}Input): Promise<{Entity}> => {
    const { databases } = useAppwrite()
    const config = useRuntimeConfig()
    const response = await databases.createDocument(
      config.public.appwriteBdKey,
      config.public.appwriteCollection{Entity},
      ID.unique(),
      data
    )
    return response as {Entity}
  }

  const update{Entity} = async (id: string, data: Partial<{Entity}>): Promise<{Entity}> => {
    const { databases } = useAppwrite()
    const config = useRuntimeConfig()
    const response = await databases.updateDocument(
      config.public.appwriteBdKey,
      config.public.appwriteCollection{Entity},
      id,
      data
    )
    return response as {Entity}
  }

  const delete{Entity} = async (id: string): Promise<void> => {
    const { databases } = useAppwrite()
    const config = useRuntimeConfig()
    await databases.deleteDocument(
      config.public.appwriteBdKey,
      config.public.appwriteCollection{Entity},
      id
    )
  }

  return {
    items: readonly(items),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetch{Entity},
    create{Entity},
    update{Entity},
    delete{Entity}
  }
}
```

3. Create type definition `app/types/{entity}.ts`:

```typescript
export interface {Entity} {
  $id: string
  $createdAt: string
  $updatedAt: string
  name: LocalizedString
  description?: LocalizedString
  slug: string
  isActive: boolean
}

export interface Create{Entity}Input {
  name: LocalizedString
  description?: LocalizedString
  slug: string
  isActive?: boolean
}
```

4. Add to `.env` and `nuxt.config.ts`:

```typescript
// .env
NUXT_PUBLIC_APPWRITE_COLLECTION_{ENTITY}=collection_id

// nuxt.config.ts runtimeConfig
appwriteCollection{Entity}: process.env.NUXT_PUBLIC_APPWRITE_COLLECTION_{ENTITY}
```

### New Catalog Component

When creating user-facing catalog components:

1. Place in `app/components/catalog/`
2. Use Telegram theme colors via `useTelegram()`
3. Always support both EN/RU via `$i18n.locale`
4. Add loading skeleton variant
5. Use `UCard`, `UButton`, `UBadge` from Nuxt UI

Template:

```vue
<script setup lang="ts">
import type { {Entity} } from '~/types/{entity}'

interface Props {
  item: {Entity}
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const { $i18n } = useNuxtApp()
const { themeParams } = useTelegram()
</script>

<template>
	<UCard
		:ui="{
			background: themeParams.bg_color,
			ring: 'ring-1 ring-gray-200 dark:ring-gray-800'
		}"
	>
		<div class="space-y-3">
			<h3 class="text-lg font-semibold">
				{{ item.name[$i18n.locale] }}
			</h3>

			<p class="text-sm text-gray-600 dark:text-gray-400">
				{{ item.description?.[$i18n.locale] }}
			</p>
		</div>
	</UCard>
</template>
```

## Image Upload Pattern

Always use this pattern for image uploads with Appwrite Storage:

```typescript
const { uploadImage, deleteImage } = useImages()

// Upload
const handleUpload = async (file: File): Promise<string> => {
	try {
		const fileId = await uploadImage(file)
		return fileId
	} catch (error) {
		console.error('Upload failed:', error)
		throw error
	}
}

// Delete old image when updating
const handleUpdate = async (oldFileId: string | null, newFile: File): Promise<string> => {
	if (oldFileId) {
		await deleteImage(oldFileId)
	}
	return await uploadImage(newFile)
}

// Get image URL
const getImageUrl = (fileId: string): string => {
	const { storage } = useAppwrite()
	const config = useRuntimeConfig()
	return storage.getFileView(config.public.appwriteBucketImages, fileId).href
}
```

## Localization Checklist

When adding new translatable content:

- [ ] Add keys to `i18n/locales/en.json`
- [ ] Add keys to `i18n/locales/ru.json`
- [ ] Use `{{ $t('key.path') }}` in templates
- [ ] Use `const { $t } = useI18n()` in script
- [ ] For database fields, use `LocalizedString` type
- [ ] Display with `item.field[$i18n.locale]`

## Telegram Integration

### Contact Button Pattern

```vue
<script setup lang="ts">
const { openTelegramLink } = useTelegram()
const config = useRuntimeConfig()

const contactAdmin = (): void => {
	openTelegramLink(`https://t.me/${config.public.telegramBotUsername}`)
}
</script>

<template>
	<UButton icon="i-lucide-send" @click="contactAdmin">
		{{ $t('contact.admin') }}
	</UButton>
</template>
```

### Theme Integration

```vue
<script setup lang="ts">
const { themeParams, headerColor, backgroundColor } = useTelegram()

// Apply theme colors
onMounted(() => {
	headerColor.value = themeParams.value.header_bg_color || '#ffffff'
	backgroundColor.value = themeParams.value.bg_color || '#ffffff'
})
</script>
```

## Slug Generation

Always generate slugs for SEO-friendly URLs:

```typescript
const generateSlug = (text: string): string => {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

// In form
const form = reactive({
	name: { en: '', ru: '' },
	slug: ''
})

watch(
	() => form.name.en,
	(newName) => {
		if (!form.slug) {
			form.slug = generateSlug(newName)
		}
	}
)
```

## Error Handling Pattern

Standard error handling across the app:

```typescript
// In composables
const performAction = async (): Promise<void> => {
	isLoading.value = true
	error.value = null

	try {
		// Action logic
	} catch (err) {
		error.value = err instanceof Error ? err.message : 'Unknown error'
		console.error('Action failed:', err)
		throw err
	} finally {
		isLoading.value = false
	}
}

// In components
const handleAction = async (): Promise<void> => {
	try {
		await performAction()
		// Success feedback
		toast.add({
			title: $t('success.title'),
			description: $t('success.description'),
			color: 'green'
		})
	} catch (error) {
		// Error feedback
		toast.add({
			title: $t('error.title'),
			description: error instanceof Error ? error.message : $t('error.unknown'),
			color: 'red'
		})
	}
}
```

## Admin Auth Pattern

Protect admin routes:

```typescript
// app/middleware/admin-auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
	const { isAdmin, checkAuth } = useAuth()

	await checkAuth()

	if (!isAdmin.value) {
		return navigateTo('/')
	}
})

// In page
definePageMeta({
	middleware: 'admin-auth',
	layout: 'admin'
})
```

## Form Validation Pattern

Use Zod for form validation:

```typescript
import { z } from 'zod'

const schema = z.object({
	name: z.object({
		en: z.string().min(1, 'English name is required'),
		ru: z.string().min(1, 'Russian name is required')
	}),
	slug: z
		.string()
		.min(1, 'Slug is required')
		.regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
	isActive: z.boolean().default(true)
})

type FormData = z.infer<typeof schema>

const validate = (data: unknown): FormData => {
	return schema.parse(data)
}

const handleSubmit = async (): Promise<void> => {
	try {
		const validData = validate(form)
		await createItem(validData)
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Handle validation errors
			error.errors.forEach((err) => {
				console.error(`${err.path.join('.')}: ${err.message}`)
			})
		}
	}
}
```

## Performance Optimization

### Lazy Loading Images

```vue
<template>
	<img :src="imageUrl" loading="lazy" :alt="item.name[$i18n.locale]" class="w-full h-48 object-cover" />
</template>
```

### Computed vs Methods

```typescript
// Use computed for derived state
const filteredItems = computed(() => {
	return items.value.filter((item) => item.isActive)
})

// Use methods for actions
const toggleActive = (id: string): void => {
	const item = items.value.find((i) => i.$id === id)
	if (item) {
		item.isActive = !item.isActive
	}
}
```

### Debounce Search

```typescript
import { useDebounceFn } from '@vueuse/core'

const searchQuery = ref('')
const searchResults = ref<Item[]>([])

const performSearch = async (query: string): Promise<void> => {
	if (!query) {
		searchResults.value = []
		return
	}

	const { databases } = useAppwrite()
	const response = await databases.listDocuments(config.public.appwriteBdKey, config.public.appwriteCollectionItems, [
		Query.search('name', query)
	])

	searchResults.value = response.documents as Item[]
}

const debouncedSearch = useDebounceFn(performSearch, 300)

watch(searchQuery, (newQuery) => {
	debouncedSearch(newQuery)
})
```

## Testing Checklist

Before committing:

- [ ] Run `npm run typecheck` - no TypeScript errors
- [ ] Run `npm run lint:fix` - code follows style guide
- [ ] Run `npm run format:fix` - code is formatted
- [ ] Test in Telegram WebView (not just browser)
- [ ] Test both EN and RU locales
- [ ] Test on mobile viewport
- [ ] Verify images load correctly
- [ ] Check admin auth protection
- [ ] Verify Appwrite operations work
- [ ] Test error states and loading states

## Common Pitfalls

### ❌ Don't mutate props

```typescript
// Bad
const props = defineProps<{ item: Item }>()
props.item.name = 'New name'

// Good
const emit = defineEmits<{ update: [item: Partial<Item>] }>()
emit('update', { name: 'New name' })
```

### ❌ Don't use magic strings

```typescript
// Bad
const response = await databases.listDocuments('db123', 'col456')

// Good
const config = useRuntimeConfig()
const response = await databases.listDocuments(config.public.appwriteBdKey, config.public.appwriteCollectionItems)
```

### ❌ Don't forget error handling

```typescript
// Bad
const loadData = async () => {
	const data = await fetchData()
	items.value = data
}

// Good
const loadData = async () => {
	try {
		const data = await fetchData()
		items.value = data
	} catch (error) {
		console.error('Failed to load data:', error)
		errorMessage.value = 'Failed to load data'
	}
}
```

### ❌ Don't use `any` type

```typescript
// Bad
const processData = (data: any) => {
	return data.map((item: any) => item.value)
}

// Good
const processData = <T extends { value: unknown }>(data: T[]): unknown[] => {
	return data.map((item) => item.value)
}
```

## Deployment Checklist

Before deploying to GitHub Pages:

- [ ] Update `.env` with production Appwrite credentials
- [ ] Verify `nuxt.config.ts` has correct `baseURL`
- [ ] Run `npm run generate` successfully
- [ ] Test generated site in `dist/` directory
- [ ] Verify all images load from Appwrite Storage
- [ ] Test Telegram WebApp integration
- [ ] Check all routes work with static hosting
- [ ] Verify admin authentication works
- [ ] Test both locales in production
- [ ] Check mobile responsiveness
