# Техническое задание для Kiro Specs

## Обзор проекта

**Название проекта:** TMA Catalog Bot  
**Тип приложения:** Telegram Mini App с административной панелью  
**Стек технологий:** Nuxt 4, Nuxt UI, Appwrite, Telegram Bot API  
**Текущий статус:** Базовая конфигурация выполнена, требуется реализация функционала

---

## 1. Цель проекта

Создать Telegram Mini App для каталога товаров/услуг для аренды с административной панелью для управления контентом.

### Основные функции:

- CRUD система для категорий и продуктов
- Просмотр каталога пользователями
- Связь с администратором через Telegram
- Многоязычность (EN/RU)

---

## 2. Архитектура приложения

### 2.1. База данных (Appwrite)

**Collections:**

#### Categories Collection

```typescript
{
	$id: string
	name: {
		en: string
		ru: string
	}
	description: {
		en: string
		ru: string
	}
	icon: string // URL или emoji
	slug: string // URL-friendly идентификатор
	sortOrder: number
	isActive: boolean
	createdAt: string
	updatedAt: string
}
```

#### Products Collection

```typescript
{
  $id: string
  categoryId: string // связь с Categories
  name: {
    en: string
    ru: string
  }
  description: {
    en: string
    ru: string
  }
  price: number
  priceUnit: string // день/час/месяц
  images: string[] // массив URL изображений
  slug: string
  features: {
    en: string[]
    ru: string[]
  }
  isAvailable: boolean
  isActive: boolean
  sortOrder: number
  contactMessage: {
    en: string
    ru: string
  } // предзаполненное сообщение для бота
  createdAt: string
  updatedAt: string
}
```

#### AdminUsers Collection

```typescript
{
	$id: string
	telegramId: number
	username: string
	firstName: string
	lastName: string
	role: 'admin' | 'superadmin'
	isActive: boolean
	createdAt: string
}
```

### 2.2. Структура файлов проекта

```
/
├── app/
│   ├── layouts/
│   │   ├── default.vue          // Основной layout для пользователей
│   │   └── admin.vue            // Layout для админки
│   ├── pages/
│   │   ├── index.vue            // Главная страница каталога
│   │   ├── category/
│   │   │   └── [slug].vue       // Список товаров категории
│   │   ├── product/
│   │   │   └── [slug].vue       // Детальная страница товара
│   │   └── admin/
│   │       ├── index.vue        // Дашборд админки
│   │       ├── categories/
│   │       │   ├── index.vue    // Список категорий
│   │       │   ├── create.vue   // Создание категории
│   │       │   └── [id].vue     // Редактирование категории
│   │       └── products/
│   │           ├── index.vue    // Список продуктов
│   │           ├── create.vue   // Создание продукта
│   │           └── [id].vue     // Редактирование продукта
│   ├── components/
│   │   ├── admin/
│   │   │   ├── Sidebar.vue
│   │   │   ├── CategoryForm.vue
│   │   │   ├── ProductForm.vue
│   │   │   ├── ImageUpload.vue
│   │   │   └── DataTable.vue
│   │   ├── catalog/
│   │   │   ├── CategoryCard.vue
│   │   │   ├── ProductCard.vue
│   │   │   ├── ProductGallery.vue
│   │   │   └── ContactButton.vue
│   │   └── common/
│   │       ├── LanguageSwitcher.vue
│   │       └── LoadingSpinner.vue
│   ├── composables/
│   │   ├── useAppwrite.ts       // Appwrite client
│   │   ├── useCategories.ts     // Работа с категориями
│   │   ├── useProducts.ts       // Работа с продуктами
│   │   ├── useAuth.ts           // Авторизация админов
│   │   └── useTelegram.ts       // Telegram WebApp API
│   ├── middleware/
│   │   └── admin-auth.ts        // Проверка прав администратора
│   ├── utils/
│   │   ├── validators.ts        // Валидация форм
│   │   ├── formatters.ts        // Форматирование данных
│   │   └── telegram.ts          // Telegram helpers
│   └── types/
│       ├── category.ts
│       ├── product.ts
│       └── admin.ts
├── server/
│   └── api/
│       ├── auth/
│       │   └── telegram.post.ts // Верификация Telegram данных
│       └── upload/
│           └── image.post.ts    // Загрузка изображений
└── locales/
    ├── en.json
    └── ru.json
```

---

## 3. Функциональные требования

### 3.1. Административная панель

#### 3.1.1. Аутентификация

- **Middleware:** Проверка Telegram ID пользователя в AdminUsers
- **Редирект:** Неавторизованные пользователи → главная страница каталога
- **Сессия:** Использовать Telegram WebApp initData для валидации

#### 3.1.2. Dashboard (`/admin`)

**Компоненты:**

- Статистика:
    - Общее количество категорий
    - Общее количество продуктов
    - Активные/неактивные продукты
- Быстрые действия:
    - Кнопка "Добавить категорию"
    - Кнопка "Добавить продукт"
- Последние добавленные продукты (5 шт)

#### 3.1.3. Управление категориями

**Список категорий (`/admin/categories`)**

- Таблица с колонками:
    - Иконка
    - Название (EN/RU)
    - Количество продуктов
    - Статус (активна/неактивна)
    - Сортировка
    - Действия (редактировать/удалить)
- Drag & drop для изменения сортировки
- Поиск по названию
- Фильтр по статусу
- Пагинация (20 элементов)

**Создание/Редактирование категории**

- Форма:
    ```typescript
    - Название EN* (required)
    - Название RU* (required)
    - Описание EN
    - Описание RU
    - Иконка (emoji picker или URL)
    - Slug* (auto-generate из названия EN)
    - Порядок сортировки (number)
    - Активна (toggle)
    ```
- Валидация:
    - Уникальность slug
    - Обязательные поля
    - Минимум 3 символа в названии
- Кнопки: "Сохранить", "Отменить"
- Превью карточки категории

**Удаление категории**

- Modal подтверждения
- Предупреждение если есть продукты в категории
- Опция: удалить с продуктами / переместить продукты в другую категорию

#### 3.1.4. Управление продуктами

**Список продуктов (`/admin/products`)**

- Таблица с колонками:
    - Изображение (thumbnail)
    - Название (EN/RU)
    - Категория
    - Цена
    - Доступность
    - Статус (активен/неактивен)
    - Действия (редактировать/удалить)
- Фильтры:
    - По категории
    - По статусу
    - По доступности
- Поиск по названию
- Сортировка по: дате, названию, цене
- Пагинация (20 элементов)

**Создание/Редактирование продукта**

- Форма (multi-step или табы):

**Вкладка 1: Основная информация**

```typescript
- Название EN* (required)
- Название RU* (required)
- Категория* (select)
- Slug* (auto-generate)
- Описание EN (textarea, rich text)
- Описание RU (textarea, rich text)
```

**Вкладка 2: Цена и доступность**

```typescript
- Цена* (number)
- Единица измерения* (select: час/день/неделя/месяц)
- Доступен для аренды (toggle)
- Активен (toggle)
- Порядок сортировки (number)
```

**Вкладка 3: Изображения**

```typescript
- Загрузка изображений (drag & drop, multiple)
- Максимум 10 изображений
- Форматы: JPG, PNG, WebP
- Максимальный размер: 5MB
- Превью загруженных изображений
- Drag & drop для изменения порядка
- Удаление изображения
```

**Вкладка 4: Дополнительно**

```typescript
- Характеристики EN (dynamic list)
- Характеристики RU (dynamic list)
- Предзаполненное сообщение EN (textarea)
- Предзаполненное сообщение RU (textarea)
```

- Валидация:
    - Уникальность slug
    - Обязательные поля
    - Цена > 0
    - Минимум 1 изображение
- Кнопки: "Сохранить", "Сохранить и добавить еще", "Отменить"
- Превью карточки продукта

**Удаление продукта**

- Modal подтверждения
- Удаление связанных изображений из Appwrite Storage

---

### 3.2. Пользовательский каталог

#### 3.2.1. Главная страница (`/`)

**Компоненты:**

- Header:
    - Название приложения
    - Переключатель языка
    - Кнопка поиска (опционально для v1.0)
- Список активных категорий:
    - Grid layout (2 колонки на mobile)
    - Карточка категории:
        - Иконка
        - Название
        - Количество товаров
        - Описание (кратко)
- Сортировка по sortOrder
- Анимация при загрузке (skeleton)

#### 3.2.2. Страница категории (`/category/[slug]`)

**Компоненты:**

- Breadcrumbs: Главная > Название категории
- Заголовок категории с описанием
- Фильтры:
    - По доступности
    - По цене (min/max)
- Сортировка:
    - По умолчанию (sortOrder)
    - По цене (возрастание/убывание)
    - По названию (A-Z)
- Список продуктов:
    - Grid layout (2 колонки на mobile)
    - Карточка продукта:
        - Основное изображение
        - Название
        - Цена
        - Badge "Недоступен" если !isAvailable
- Пагинация или infinite scroll
- Пустое состояние если продуктов нет

#### 3.2.3. Страница продукта (`/product/[slug]`)

**Компоненты:**

- Breadcrumbs: Главная > Категория > Название продукта
- Галерея изображений:
    - Swiper/Carousel
    - Lightbox при клике
    - Индикаторы (dots)
- Информационный блок:
    - Название продукта
    - Категория (ссылка)
    - Цена с единицей измерения
    - Статус доступности
- Описание (expandable если длинное)
- Характеристики (список)
- Кнопка "Связаться":
    - Открывает Telegram чат с ботом
    - Предзаполненное сообщение:

        ```
        Здравствуйте! Меня интересует:

        📦 [Название продукта]
        💰 Цена: [цена] / [единица]
        🔗 Ссылка: [ссылка на продукт в TMA]
        ```

    - Использует `window.Telegram.WebApp.openTelegramLink()`
- Кнопка "Назад к категории"

---

## 4. Технические требования

### 4.1. Appwrite Configuration

**Database:**

- Название: `tma_catalog`
- Collections: Categories, Products, AdminUsers

**Indexes:**

```typescript
Categories: -slug(unique) - isActive(boolean) - sortOrder(ascending)

Products: -slug(unique) -
	categoryId(relationship) -
	isActive(boolean) -
	isAvailable(boolean) -
	sortOrder(ascending) -
	price(ascending)

AdminUsers: -telegramId(unique) - isActive(boolean)
```

**Storage:**

- Bucket: `product_images`
- Максимальный размер файла: 5MB
- Разрешенные типы: image/jpeg, image/png, image/webp
- Permissions: read access для всех, write для админов

**Permissions:**

```typescript
Categories, Products:
  - Read: любой пользователь
  - Create/Update/Delete: только админы

AdminUsers:
  - Read/Write: только админы

product_images:
  - Read: любой пользователь
  - Write: только админы
```

### 4.2. Composables

#### useAppwrite.ts

```typescript
export const useAppwrite = () => {
	const config = useRuntimeConfig()
	const client = new Client().setEndpoint(config.public.appwriteEndpoint).setProject(config.public.appwriteProjectId)

	const databases = new Databases(client)
	const storage = new Storage(client)

	return { client, databases, storage }
}
```

#### useCategories.ts

```typescript
export const useCategories = () => {
	const fetchCategories = async (activeOnly = true) => {}
	const getCategoryBySlug = async (slug: string) => {}
	const createCategory = async (data: CreateCategoryInput) => {}
	const updateCategory = async (id: string, data: UpdateCategoryInput) => {}
	const deleteCategory = async (id: string) => {}
	const reorderCategories = async (items: { id: string; sortOrder: number }[]) => {}

	return {
		fetchCategories,
		getCategoryBySlug,
		createCategory,
		updateCategory,
		deleteCategory,
		reorderCategories
	}
}
```

#### useProducts.ts

```typescript
export const useProducts = () => {
	const fetchProducts = async (filters?: ProductFilters) => {}
	const getProductBySlug = async (slug: string) => {}
	const getProductsByCategory = async (categoryId: string) => {}
	const createProduct = async (data: CreateProductInput) => {}
	const updateProduct = async (id: string, data: UpdateProductInput) => {}
	const deleteProduct = async (id: string) => {}
	const uploadProductImage = async (file: File) => {}
	const deleteProductImage = async (fileId: string) => {}

	return {
		fetchProducts,
		getProductBySlug,
		getProductsByCategory,
		createProduct,
		updateProduct,
		deleteProduct,
		uploadProductImage,
		deleteProductImage
	}
}
```

#### useAuth.ts

```typescript
export const useAuth = () => {
	const isAdmin = ref(false)
	const currentUser = ref<AdminUser | null>(null)

	const checkAdminAccess = async () => {
		// Проверка Telegram initData
		// Проверка в AdminUsers collection
	}

	const login = async () => {}
	const logout = () => {}

	return { isAdmin, currentUser, checkAdminAccess, login, logout }
}
```

#### useTelegram.ts

```typescript
export const useTelegram = () => {
	const webApp = ref<any>(null)
	const initData = ref<string>('')
	const user = ref<any>(null)

	const init = () => {
		if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
			webApp.value = window.Telegram.WebApp
			initData.value = webApp.value.initData
			user.value = webApp.value.initDataUnsafe?.user
			webApp.value.ready()
			webApp.value.expand()
		}
	}

	const openTelegramLink = (url: string) => {
		webApp.value?.openTelegramLink(url)
	}

	const showAlert = (message: string) => {
		webApp.value?.showAlert(message)
	}

	const showConfirm = (message: string): Promise<boolean> => {
		return new Promise((resolve) => {
			webApp.value?.showConfirm(message, resolve)
		})
	}

	return {
		webApp,
		initData,
		user,
		init,
		openTelegramLink,
		showAlert,
		showConfirm
	}
}
```

### 4.3. Middleware

#### admin-auth.ts

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
	const { isAdmin, checkAdminAccess } = useAuth()

	if (!isAdmin.value) {
		await checkAdminAccess()
	}

	if (!isAdmin.value) {
		return navigateTo('/')
	}
})
```

### 4.4. UI Components (Nuxt UI)

**Используемые компоненты:**

- `<UButton>` - кнопки
- `<UInput>` - поля ввода
- `<UTextarea>` - текстовые области
- `<USelect>` - выпадающие списки
- `<UToggle>` - переключатели
- `<UTable>` - таблицы для админки
- `<UCard>` - карточки
- `<UModal>` - модальные окна
- `<UAlert>` - уведомления
- `<UBadge>` - badges
- `<UPagination>` - пагинация
- `<UDropdown>` - выпадающие меню
- `<USkeleton>` - loading states
- `<UBreadcrumb>` - хлебные крошки
- `<UFormGroup>` - группировка полей формы
- `<UContainer>` - контейнеры

**Кастомные компоненты:**

- ImageUpload - загрузка и превью изображений
- DataTable - расширенная таблица с сортировкой и фильтрами
- CategoryForm - форма категории
- ProductForm - форма продукта (multi-step)
- ContactButton - кнопка связи с Telegram

---

## 5. UI/UX требования

### 5.1. Дизайн система

**Цветовая схема:**

- Использовать Telegram theme colors:
    ```typescript
    bg_color
    text_color
    hint_color
    link_color
    button_color
    button_text_color
    secondary_bg_color
    ```

**Типографика:**

- Использовать системные шрифты
- Размеры: 12px, 14px, 16px, 20px, 24px
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Отступы:**

- Базовая сетка: 4px
- Стандартные отступы: 8px, 12px, 16px, 24px, 32px

**Радиусы:**

- Small: 8px
- Medium: 12px
- Large: 16px

### 5.2. Адаптивность

**Breakpoints:**

- Mobile: < 640px (основной фокус)
- Tablet: 640px - 1024px
- Desktop: > 1024px (админка)

**Требования:**

- Mobile-first подход
- Touch-friendly элементы (минимум 44x44px для кнопок)
- Оптимизация для одной руки (важные действия в нижней части)

### 5.3. Анимации

**Transitions:**

- Длительность: 150ms - 300ms
- Easing: ease-in-out
- Применять к: opacity, transform, background-color

**Loading states:**

- Skeleton screens для контента
- Spinners для действий
- Progress bar для загрузки изображений

### 5.4. Обработка ошибок

**Типы уведомлений:**

- Success: зеленый UAlert
- Error: красный UAlert
- Warning: желтый UAlert
- Info: синий UAlert

**Сообщения:**

- Краткие и понятные
- На выбранном языке
- С возможностью закрытия

---

## 6. Локализация

### 6.1. Структура переводов

**Файл en.json:**

```json
{
	"common": {
		"save": "Save",
		"cancel": "Cancel",
		"delete": "Delete",
		"edit": "Edit",
		"create": "Create",
		"search": "Search",
		"filter": "Filter",
		"sort": "Sort",
		"loading": "Loading...",
		"noResults": "No results found",
		"confirm": "Are you sure?",
		"success": "Success",
		"error": "Error"
	},
	"nav": {
		"home": "Home",
		"categories": "Categories",
		"products": "Products",
		"admin": "Admin Panel"
	},
	"category": {
		"title": "Categories",
		"create": "Create Category",
		"edit": "Edit Category",
		"delete": "Delete Category",
		"deleteConfirm": "Delete this category? All products will be unassigned.",
		"fields": {
			"name": "Name",
			"description": "Description",
			"icon": "Icon",
			"slug": "Slug",
			"sortOrder": "Sort Order",
			"isActive": "Active"
		}
	},
	"product": {
		"title": "Products",
		"create": "Create Product",
		"edit": "Edit Product",
		"delete": "Delete Product",
		"contact": "Contact",
		"available": "Available",
		"unavailable": "Unavailable",
		"fields": {
			"name": "Name",
			"description": "Description",
			"category": "Category",
			"price": "Price",
			"priceUnit": "Price Unit",
			"images": "Images",
			"features": "Features",
			"contactMessage": "Contact Message",
			"isAvailable": "Available",
			"isActive": "Active"
		}
	}
}
```

**Файл ru.json:**

```json
{
	"common": {
		"save": "Сохранить",
		"cancel": "Отменить",
		"delete": "Удалить",
		"edit": "Редактировать",
		"create": "Создать",
		"search": "Поиск",
		"filter": "Фильтр",
		"sort": "Сортировка",
		"loading": "Загрузка...",
		"noResults": "Ничего не найдено",
		"confirm": "Вы уверены?",
		"success": "Успешно",
		"error": "Ошибка"
	}
	// ... остальные переводы
}
```

---

## 7. План разработки (фазы)

### Фаза 1: Backend и модели данных (3-5 дней)

- [ ] Настройка Appwrite Collections
- [ ] Настройка Storage bucket
- [ ] Создание типов TypeScript
- [ ] Реализация composables (useCategories, useProducts)
- [ ] Тестирование CRUD операций

### Фаза 2: Административная панель - Категории (3-4 дня)

- [ ] Layout админки с sidebar
- [ ] Dashboard страница
- [ ] Список категорий с таблицей
- [ ] Форма создания/редактирования категории
- [ ] Удаление категории
- [ ] Drag & drop сортировка

### Фаза 3: Административная панель - Продукты (5-7 дней)

- [ ] Список продуктов с таблицей
- [ ] Фильтры и поиск
- [ ] Форма создания/редактирования продукта (multi-step)
- [ ] Загрузка изображений
- [ ] Управление галереей
- [ ] Удаление продукта

### Фаза 4: Пользовательский каталог (4-5 дней)

- [ ] Главная страница со списком категорий
- [ ] Страница категории со списком продуктов
- [ ] Детальная страница продукта
- [ ] Галерея изображений
- [ ] Кнопка связи с Telegram
- [ ] Breadcrumbs и навигация

### Фаза 5: Авторизация и безопасность (2-3 дня)

- [ ] Middleware для проверки админов
- [ ] Composable useAuth
- [ ] Server API для валидации Telegram initData
- [ ] Permissions в Appwrite

### Фаза 6: Полировка и оптимизация (2-3 дня)

- [ ] Обработка ошибок
- [ ] Loading states
- [ ] Анимации и transitions
- [ ] Оптимизация изображений
- [ ] SEO (meta tags)
- [ ] Тестирование на разных устройствах

### Фаза 7: Деплой и документация (1-2 дня)

- [ ] Финальная сборка для GitHub Pages
- [ ] Настройка Telegram Bot с Web App кнопкой
- [ ] README с инструкцией по установке
- [ ] Документация для администраторов

**Общее время: 20-29 дней**

---

## 8. Критерии готовности

### Обязательные функции (MVP):

- ✅ Админка: CRUD категорий
- ✅ Админка: CRUD продуктов с изображениями
- ✅ Каталог: просмотр категорий
- ✅ Каталог: просмотр продуктов
- ✅ Детальная страница продукта с галереей
- ✅ Кнопка связи с Telegram ботом
- ✅ Двуязычность (EN/RU)
- ✅ Авторизация админов через Telegram ID

### Опциональные функции (v1.1):

- ⭕ Поиск по каталогу
- ⭕ Продвинутые фильтры
- ⭕ Статистика в админке
- ⭕ Экспорт/импорт данных
- ⭕ История изменений
- ⭕ Уведомления администраторам

---

## 9. Требования к производительности

- Время загрузки главной страницы: < 2 сек
- Время загрузки страницы продукта: < 3 сек
- Размер bundle: < 500KB (gzip)
- Оптимизация изображений: WebP, lazy loading
- Кеширование данных Appwrite (5 мин)

---

## 10. Безопасность

- Валидация всех пользовательских вводов
- Sanitization HTML в rich text полях
- HTTPS для всех запросов
- Проверка Telegram initData hash
- Rate limiting для API (через Appwrite)
- XSS protection
- CSRF protection

---

## 11. Дополнительные заметки

### Telegram Bot Setup

```typescript
// Bot должен иметь команду для открытия Web App
/start - открыть каталог

// Кнопка в меню бота
{
  text: "🛍 Открыть каталог",
  web_app: { url: "https://yourusername.github.io/nuxt-tma-catalog/" }
}
```

### Environment Variables для продакшена

```env
APPWRITE_PUBLIC_PROJECT_ID="your-project-id"
APPWRITE_PUBLIC_ENDPOINT="https://cloud.appwrite.io/v1"
APPWRITE_PUBLIC_BD_KEY="your-database-id"
APPWRITE_PUBLIC_COLLECTION_CATEGORIES_ID="categories-collection-id"
APPWRITE_PUBLIC_COLLECTION_PRODUCTS_ID="products-collection-id"
APPWRITE_PUBLIC_STORAGE_BUCKET_ID="product-images-bucket-id"
TELEGRAM_BOT_TOKEN="your-bot-token"
```
---

**Контакты для вопросов:** [Указать способ связи]

**Версия документа:** 1.0  
**Дата создания:** 02.02.2026
