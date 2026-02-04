# Категории и Продукты - Структура данных

## Категории (Categories)

### Поля категории:
```typescript
interface Category {
  $id: string                    // Уникальный ID
  name: {                        // Локализованное название
    en: string                   // Английское название
    ru: string                   // Русское название
  }
  description: {                 // Локализованное описание
    en: string                   // Английское описание
    ru: string                   // Русское описание
  }
  icon: string                   // Иконка (например: 'home', 'car', 'bike')
  slug: string                   // URL-слаг для SEO
  sortOrder: number              // Порядок сортировки
  isActive: boolean              // Активна ли категория
  imgId?: string                 // ID изображения (опционально)
}
```

### Пример создания категории:
```typescript
const categoryData = {
  name: {
    en: "Electronics",
    ru: "Электроника"
  },
  description: {
    en: "Electronic devices and gadgets",
    ru: "Электронные устройства и гаджеты"
  },
  icon: "smartphone",
  slug: "electronics",
  sortOrder: 1,
  isActive: true
}
```

## Продукты (Products)

### Поля продукта:
```typescript
interface Product {
  $id: string                    // Уникальный ID
  categoryId: string             // ID категории
  name: {                        // Локализованное название
    en: string                   // Английское название
    ru: string                   // Русское название
  }
  description: {                 // Локализованное описание
    en: string                   // Английское описание
    ru: string                   // Русское описание
  }
  price: number                  // Цена (число)
  priceUnit: string              // Единица цены (например: "₽/день", "day", "hour")
  images: string[]               // МАССИВ ID изображений из Appwrite Storage
  slug: string                   // URL-слаг для SEO
  features: {                    // Локализованные особенности
    en: string[]                 // Массив особенностей на английском
    ru: string[]                 // Массив особенностей на русском
  }
  isAvailable: boolean           // Доступен ли для аренды
  isActive: boolean              // Активен ли продукт
  sortOrder: number              // Порядок сортировки
  contactMessage: {              // Локализованное сообщение для связи
    en: string                   // Сообщение на английском
    ru: string                   // Сообщение на русском
  }
}
```

### Пример создания продукта:
```typescript
const productData = {
  categoryId: "houses-rental",
  name: {
    en: "Luxury Villa",
    ru: "Роскошная вилла"
  },
  description: {
    en: "Beautiful villa with ocean view",
    ru: "Красивая вилла с видом на океан"
  },
  price: 5000,
  priceUnit: "₽/день",
  images: ["image_id_1", "image_id_2", "image_id_3"], // Массив ID изображений
  slug: "luxury-villa",
  features: {
    en: ["Ocean view", "Private pool", "3 bedrooms"],
    ru: ["Вид на океан", "Частный бассейн", "3 спальни"]
  },
  isAvailable: true,
  isActive: true,
  sortOrder: 1,
  contactMessage: {
    en: "Contact us to book this amazing villa",
    ru: "Свяжитесь с нами для бронирования этой потрясающей виллы"
  }
}
```

## Изображения - ВАЖНО!

### Правильный формат images:
```javascript
// ✅ ПРАВИЛЬНО - массив строк
"images": ["698026f9000b019b398a", "another_image_id", "third_image_id"]

// ✅ ПРАВИЛЬНО - пустой массив если нет изображений  
"images": []

// ❌ НЕПРАВИЛЬНО - строка вместо массива
"images": "698026f9000b019b398a"

// ❌ НЕПРАВИЛЬНО - массив в строке
"images": "['698026f9000b019b398a']"
```

### Как работает с изображениями:
- `images` - это **МАССИВ** строк с ID файлов из Appwrite Storage
- Для превью используется **ПЕРВОЕ** изображение: `product.images[0]`
- Пустой массив `[]` означает отсутствие изображений
- Максимум рекомендуется 5 изображений на продукт

### Пример работы с изображениями в коде:
```typescript
// Получить первое изображение для превью
const previewImage = product.images[0] || null

// Проверить есть ли изображения
const hasImages = product.images.length > 0

// Получить URL первого изображения
const imageUrl = hasImages ? getImageUrl(product.images[0]) : null
```

## Существующие категории в проекте:

1. **houses-rental** - Аренда домов
2. **motorcycles-rental** - Аренда мотоциклов  
3. **cars-rental** - Аренда автомобилей

## Создание через MCP API

### Создать категорию:
```javascript
await mcp_appwrite_api_tables_db_create_row({
  database_id: "696deae40009bb04e0fc",
  table_id: "categories", 
  row_id: "unique-category-id",
  data: {
    name: '{"en": "Category Name", "ru": "Название категории"}',
    description: '{"en": "Description", "ru": "Описание"}',
    icon: "icon-name",
    slug: "category-slug",
    sortOrder: 1,
    isActive: true
  }
})
```

### Создать продукт:
```javascript
await mcp_appwrite_api_tables_db_create_row({
  database_id: "696deae40009bb04e0fc",
  table_id: "products",
  row_id: "unique-product-id", 
  data: {
    categoryId: "existing-category-id",
    name: '{"en": "Product Name", "ru": "Название продукта"}',
    description: '{"en": "Description", "ru": "Описание"}',
    price: 1000,
    priceUnit: "₽/день",
    images: ["image_id_1", "image_id_2"], // Массив ID изображений
    slug: "product-slug",
    features: '{"en": ["Feature 1", "Feature 2"], "ru": ["Особенность 1", "Особенность 2"]}',
    isAvailable: true,
    isActive: true,
    sortOrder: 1,
    contactMessage: '{"en": "Contact message", "ru": "Сообщение для связи"}'
  }
})
```

## Важные моменты:

1. **Локализация**: Все текстовые поля должны быть объектами с `en` и `ru`
2. **Images**: Массив строк с ID файлов, первый элемент для превью
3. **JSON в строках**: При создании через API локализованные поля передаются как JSON-строки
4. **Slug**: Должен быть уникальным для SEO-URL
5. **CategoryId**: Должен существовать в таблице categories