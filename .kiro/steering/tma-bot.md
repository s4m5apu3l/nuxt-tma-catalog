<!------------------------------------------------------------------------------------
   Add Rules to this file or a short description and have Kiro refine them for you:
------------------------------------------------------------------------------------>

# TMA Bot Project Rules

## 🎯 Core Principles

1. **Minimal Comments** - Code должен быть самодокументируемым. Комментарии только для сложной логики и объяснения "ПОЧЕМУ", а не "ЧТО". Не пиши комменты внутри template, только очень важные
2. **Always Format** - Всегда запускать `npm run format:fix` и `npm run lint:fix` перед коммитом.
3. **TypeScript Strict** - Явные типы для всех функций и переменных. .
4. **Composition API Only** - Всегда использовать `<script setup lang="ts">` в Vue компонентах.

---

## 📝 Comments

```typescript
// ❌ Плохо (очевидные комментарии)
// Get user by ID
const user = await getUser(id)

// ✅ Хорошо (без комментариев)
const user = await getUser(id)

// ✅ Хорошо (объясняет WHY)
// Telegram требует валидацию initData в течение 24 часов
const isValid = validateTimestamp(initData, 86400)
```

---

## 🎨 Formatting

**Перед каждым коммитом:**

```bash
npm run format:fix  # Prettier
npm run lint:fix    # ESLint
npm run typecheck   # TypeScript
```

**Настройки Prettier:**

- Без точки с запятой
- Одинарные кавычки
- 2 пробела отступ
- Максимум 100 символов в строке

---

## 🔷 TypeScript

```typescript
// ✅ Всегда явные типы
const fetchUser = async (id: string): Promise<User> => {
	return await databases.getDocument(dbId, collectionId, id)
}

// ✅ Интерфейсы для объектов
interface Product {
	$id: string
	name: Record<'en' | 'ru', string>
	price: number
	isActive: boolean
}

// ❌ Никогда any
// ✅ Используй unknown и проверяй тип
const handleError = (error: unknown) => {
	if (error instanceof Error) {
		console.error(error.message)
	}
}
```

---

## 🧩 Components

```vue
<script setup lang="ts">
// 1. Imports
import type { Product } from '~/types/product'

// 2. Props & Emits
interface Props {
	product: Product
}
const props = defineProps<Props>()
const emit = defineEmits<{ delete: [id: string] }>()

// 3. Composables
const { t } = useI18n()
const { deleteProduct } = useProducts()

// 4. State
const loading = ref(false)

// 5. Methods
const handleDelete = async () => {
	loading.value = true
	try {
		await deleteProduct(props.product.$id)
		emit('delete', props.product.$id)
	} finally {
		loading.value = false
	}
}
</script>

<!-- внутри template минимум комментов таких как инфо про status card не нужна -->
<template>
	<UCard>
		<UButton :loading="loading" @click="handleDelete">
			{{ t('common.delete') }}
		</UButton>
	</UCard>
</template>
```

**Naming:**

- Components: `PascalCase.vue`
- Composables: `useProducts.ts`
- Pages: `kebab-case.vue`

---

## 🪝 Composables

```typescript
export const useProducts = () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchProducts = async (): Promise<void> => {
    loading.value = true
    try {
      const response = await databases.listDocuments(...)
      products.value = response.documents as Product[]
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    fetchProducts
  }
}
```

**Правила:**

- Возвращать `readonly()` для state
- Всегда try-catch для async операций
- Обрабатывать loading/error состояния

---

## 🌐 i18n

```typescript
// ✅ Вложенные ключи
t('product.create.success')
t('common.delete')

// ❌ Плоские generic ключи
t('message1')
t('title')
```

---

## ⚠️ Error Handling

```typescript
try {
	await createProduct(data)
	useToast().add({
		title: t('common.success'),
		color: 'green'
	})
} catch (error) {
	useToast().add({
		title: t('common.error'),
		color: 'red'
	})
	console.error('Create product failed:', error)
}
```

---

## 🚀 Performance

- Lazy loading для изображений: `loading="lazy"`
- WebP формат для картинок
- Пагинация: 20 элементов на страницу
- Кэширование Appwrite запросов (5 мин)

---

## 📦 Git Commits

**Conventional Commits:**

```
feat: add product gallery
fix: category deletion bug
refactor: optimize queries
style: format code
chore: update deps
```

---

## ✅ Checklist Before Commit

- [ ] Запустил `pnpm format:fix`
- [ ] Запустил `pnpm lint:fix`
- [ ] Запустил `pnpm typecheck`
- [ ] Нет ошибок в консоли
