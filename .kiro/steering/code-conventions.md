# Code Style & Conventions

## Core Principles

### 1. NO Comments in Templates
- **NEVER** add comments inside `<template>` sections
- Template code must be self-documenting through clear structure and naming
- Comments only allowed in `<script>` sections for complex business logic explaining "WHY", not "WHAT"

### 2. Always Format
- Run `npm run format:fix` and `npm run lint:fix` before every commit
- Configure IDE to format on save
- Use Prettier and ESLint configurations as defined in project

### 3. TypeScript Strict
- Explicit types for all function parameters and return values
- No `any` types - use proper interfaces or unions
- Define interfaces for all object shapes
- Use type assertions sparingly and with good reason

### 4. Composition API Only
- Always use `<script setup lang="ts">` in Vue components
- No Options API patterns
- Prefer composables over mixins

## File Naming Conventions

### Components
```typescript
// ✅ Good - PascalCase
CategoryCard.vue
ProductForm.vue
ImageUpload.vue
AdminSidebar.vue

// ❌ Bad
categoryCard.vue
product-form.vue
imageupload.vue
```

### Composables
```typescript
// ✅ Good - camelCase with 'use' prefix
useCategories.ts
useProducts.ts
useAuth.ts
useTelegram.ts

// ❌ Bad
Categories.ts
products-composable.ts
authComposable.ts
```

### Pages & Layouts
```typescript
// ✅ Good - kebab-case for pages
index.vue
[slug].vue
admin-dashboard.vue

// ✅ Good - PascalCase for layouts
Default.vue
Admin.vue
```

### Types & Utils
```typescript
// ✅ Good - camelCase
category.ts
product.ts
appwrite.ts
format.ts
```

## Component Structure

### Preferred Component Pattern
```vue
<script setup lang="ts">
// 1. Imports (external libraries first, then internal)
import { z } from 'zod'
import type { Category } from '~/types/category'

// 2. Props with explicit types
interface Props {
  category: Category
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

// 3. Emits with explicit types
interface Emits {
  update: [category: Category]
  delete: [id: string]
}

const emit = defineEmits<Emits>()

// 4. Composables
const { $t } = useI18n()
const { updateCategory } = useCategories()

// 5. Reactive state
const isEditing = ref(false)
const form = reactive({
  name: props.category.name,
  description: props.category.description
})

// 6. Computed properties
const isValid = computed(() => {
  return form.name.en.length > 0 && form.name.ru.length > 0
})

// 7. Methods
const handleSave = async (): Promise<void> => {
  if (!isValid.value) return
  
  try {
    const updated = await updateCategory(props.category.$id, form)
    emit('update', updated)
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update category:', error)
  }
}

// 8. Lifecycle hooks
onMounted(() => {
  // Initialization logic
})
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ category.name[$i18n.locale] }}
      </h3>
    </template>

    <div class="space-y-4">
      <p class="text-gray-600">
        {{ category.description[$i18n.locale] }}
      </p>
      
      <div class="flex gap-2">
        <UButton 
          @click="isEditing = true"
          :disabled="isLoading"
        >
          {{ $t('common.edit') }}
        </UButton>
        
        <UButton 
          color="red" 
          variant="outline"
          @click="emit('delete', category.$id)"
        >
          {{ $t('common.delete') }}
        </UButton>
      </div>
    </div>
  </UCard>
</template>
```

## Import Ordering

### Standard Import Order
```typescript
// 1. Node modules (external libraries)
import { z } from 'zod'
import { Client, Databases } from 'appwrite'

// 2. Nuxt/Vue imports (if explicit import needed)
import { ref, computed, onMounted } from 'vue'

// 3. Internal types (type-only imports)
import type { Category } from '~/types/category'
import type { Product } from '~/types/product'

// 4. Internal utilities and composables
import { formatPrice } from '~/utils/format'
import { useCategories } from '~/composables/useCategories'

// 5. Components (if explicit import needed)
import CategoryCard from '~/components/catalog/CategoryCard.vue'
```

## Composable Patterns

### Preferred Composable Structure
```typescript
// useCategories.ts
import type { Category, CreateCategoryInput } from '~/types/category'

export const useCategories = () => {
  // State
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Methods with explicit return types
  const fetchCategories = async (activeOnly = true): Promise<Category[]> => {
    isLoading.value = true
    error.value = null
    
    try {
      const { databases } = useAppwrite()
      const response = await databases.listDocuments(
        useRuntimeConfig().public.appwriteBdKey,
        useRuntimeConfig().public.appwriteCollectionCategories,
        activeOnly ? [Query.equal('isActive', true)] : []
      )
      
      categories.value = response.documents as Category[]
      return categories.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (data: CreateCategoryInput): Promise<Category> => {
    // Implementation
  }

  // Return object with explicit types
  return {
    // State
    categories: readonly(categories),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Methods
    fetchCategories,
    createCategory
  } as const
}
```

## Type Definitions

### Interface Naming
```typescript
// ✅ Good - Clear, descriptive names
interface Category {
  $id: string
  name: LocalizedString
  slug: string
  isActive: boolean
}

interface CreateCategoryInput {
  name: LocalizedString
  description?: LocalizedString
  slug: string
}

interface CategoryFilters {
  isActive?: boolean
  search?: string
}

// ❌ Bad - Generic or unclear names
interface Data {
  id: string
  value: any
}

interface Input {
  data: unknown
}
```

### Utility Types
```typescript
// Common utility types
type LocalizedString = {
  en: string
  ru: string
}

type ApiResponse<T> = {
  documents: T[]
  total: number
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error'
```

## Anti-Patterns to Avoid

### ❌ Don't Use Options API
```vue
<!-- Bad -->
<script lang="ts">
export default {
  data() {
    return {
      categories: []
    }
  },
  methods: {
    fetchData() {
      // ...
    }
  }
}
</script>
```

### ❌ Don't Use `any` Types
```typescript
// Bad
const processData = (data: any): any => {
  return data.map((item: any) => item.value)
}

// Good
const processData = <T extends { value: unknown }>(data: T[]): unknown[] => {
  return data.map(item => item.value)
}
```

### ❌ Don't Mutate Props Directly
```vue
<script setup lang="ts">
interface Props {
  category: Category
}

const props = defineProps<Props>()

// Bad
const updateName = () => {
  props.category.name = 'New name' // Mutating prop
}

// Good
const emit = defineEmits<{
  update: [category: Partial<Category>]
}>()

const updateName = () => {
  emit('update', { name: 'New name' })
}
</script>
```

### ❌ Don't Use Inline Styles
```vue
<!-- Bad -->
<template>
  <div style="margin-top: 20px; color: red;">
    Content
  </div>
</template>

<!-- Good -->
<template>
  <div class="mt-5 text-red-500">
    Content
  </div>
</template>
```

### ❌ Don't Use Magic Numbers/Strings
```typescript
// Bad
const fetchProducts = async () => {
  const response = await databases.listDocuments('db123', 'products456')
}

// Good
const fetchProducts = async () => {
  const config = useRuntimeConfig()
  const response = await databases.listDocuments(
    config.public.appwriteBdKey,
    config.public.appwriteCollectionProducts
  )
}
```

## Error Handling Patterns

### Preferred Error Handling
```typescript
// In composables
const createCategory = async (data: CreateCategoryInput): Promise<Category> => {
  try {
    const response = await databases.createDocument(/* ... */)
    return response as Category
  } catch (error) {
    // Log for debugging
    console.error('Failed to create category:', error)
    
    // Re-throw with context
    throw new Error(
      error instanceof Error 
        ? `Category creation failed: ${error.message}`
        : 'Category creation failed: Unknown error'
    )
  }
}

// In components
const handleCreate = async (): Promise<void> => {
  try {
    await createCategory(formData)
    // Success handling
    await navigateTo('/admin/categories')
  } catch (error) {
    // User-friendly error display
    errorMessage.value = error instanceof Error 
      ? error.message 
      : 'Something went wrong'
  }
}
```

## Performance Best Practices

### Computed vs Methods
```vue
<script setup lang="ts">
// ✅ Good - Use computed for derived state
const filteredProducts = computed(() => {
  return products.value.filter(p => p.isActive)
})

// ❌ Bad - Don't use methods for derived state in template
const getFilteredProducts = () => {
  return products.value.filter(p => p.isActive)
}
</script>

<template>
  <!-- Good -->
  <div v-for="product in filteredProducts" :key="product.$id">
    {{ product.name }}
  </div>
  
  <!-- Bad - Method called on every render -->
  <div v-for="product in getFilteredProducts()" :key="product.$id">
    {{ product.name }}
  </div>
</template>
```

### Reactive vs Ref
```typescript
// ✅ Good - Use ref for primitives
const isLoading = ref(false)
const count = ref(0)
const message = ref('')

// ✅ Good - Use reactive for objects
const form = reactive({
  name: { en: '', ru: '' },
  description: { en: '', ru: '' }
})

// ❌ Bad - Don't use reactive for primitives
const isLoading = reactive({ value: false })
```

## Testing Considerations

### Component Testing Setup
```typescript
// Component should be easily testable
// Avoid complex logic in components - move to composables
// Use dependency injection for external services

// Good - Testable component
<script setup lang="ts">
interface Props {
  categoryId: string
}

const props = defineProps<Props>()
const { fetchCategory } = useCategories()

const category = ref<Category | null>(null)

const loadCategory = async (): Promise<void> => {
  category.value = await fetchCategory(props.categoryId)
}

onMounted(loadCategory)
</script>
```