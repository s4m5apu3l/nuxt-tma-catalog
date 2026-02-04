# 🚀 Инструкция по настройке Appwrite для TMA Catalog Bot

## 📋 Обзор

Этот проект использует Appwrite как backend для Telegram Mini App каталога товаров. Вам нужно создать:

- 1 База данных
- 2 Коллекции (Categories, Products)
- 1 Bucket для изображений
- Настроить аутентификацию

---

## 🔧 1. Создание проекта в Appwrite

1. Зайдите в [Appwrite Console](https://cloud.appwrite.io/)
2. Создайте новый проект с названием `tma-catalog`
3. Скопируйте **Project ID** - он понадобится для `.env`

---

## 🗄️ 2. Создание базы данных

1. Перейдите в раздел **Databases**
2. Нажмите **Create Database**
3. Название: `tma-catalog-db`
4. Database ID: `tma-catalog-db` (или любой другой)
5. Скопируйте **Database ID** для `.env`

---

## 📁 3. Создание коллекций

### 3.1 Коллекция Categories

**Настройки коллекции:**

- Collection ID: `categories`
- Name: `Categories`

**Атрибуты:**

| Attribute Key | Type    | Size | Required | Default | Array |
| ------------- | ------- | ---- | -------- | ------- | ----- |
| `name`        | JSON    | -    | ✅       | -       | ❌    |
| `description` | JSON    | -    | ✅       | -       | ❌    |
| `icon`        | String  | 255  | ✅       | -       | ❌    |
| `slug`        | String  | 255  | ✅       | -       | ❌    |
| `sortOrder`   | Integer | -    | ❌       | 0       | ❌    |
| `isActive`    | Boolean | -    | ❌       | true    | ❌    |

**Индексы:**

- `slug` (unique)
- `isActive`
- `sortOrder`

**Permissions:**

- Read: `any`
- Create: `users` (для админов)
- Update: `users` (для админов)
- Delete: `users` (для админов)

### 3.2 Коллекция Products

**Настройки коллекции:**

- Collection ID: `products`
- Name: `Products`

**Атрибуты:**

| Attribute Key    | Type    | Size | Required | Default | Array |
| ---------------- | ------- | ---- | -------- | ------- | ----- |
| `categoryId`     | String  | 255  | ✅       | -       | ❌    |
| `name`           | JSON    | -    | ✅       | -       | ❌    |
| `description`    | JSON    | -    | ✅       | -       | ❌    |
| `price`          | Float   | -    | ✅       | -       | ❌    |
| `priceUnit`      | String  | 10   | ✅       | "₽"     | ❌    |
| `images`         | String  | 255  | ❌       | -       | ✅    |
| `slug`           | String  | 255  | ✅       | -       | ❌    |
| `features`       | JSON    | -    | ❌       | -       | ❌    |
| `isAvailable`    | Boolean | -    | ❌       | true    | ❌    |
| `isActive`       | Boolean | -    | ❌       | true    | ❌    |
| `sortOrder`      | Integer | -    | ❌       | 0       | ❌    |
| `contactMessage` | JSON    | -    | ❌       | -       | ❌    |

**Индексы:**

- `categoryId`
- `slug` (unique)
- `isActive`
- `isAvailable`
- `sortOrder`

**Permissions:**

- Read: `any`
- Create: `users` (для админов)
- Update: `users` (для админов)
- Delete: `users` (для админов)

---

## 🖼️ 4. Создание Storage Bucket

1. Перейдите в раздел **Storage**
2. Нажмите **Create Bucket**
3. Bucket ID: `images`
4. Name: `Product Images`
5. **Permissions:**
    - Read: `any`
    - Create: `users`
    - Update: `users`
    - Delete: `users`
6. **File Security:** Enabled
7. **Maximum File Size:** 10MB
8. **Allowed File Extensions:** `jpg,jpeg,png,webp,gif`

---

## 🔐 5. Настройка Authentication

1. Перейдите в **Auth** → **Settings**
2. **User Registration:** Disabled (только админы)
3. **Email/Password:** Enabled

### Создание админ пользователя:

1. Перейдите в **Auth** → **Users**
2. Нажмите **Create User**
3. Заполните данные:
    - Email: ваш email
    - Password: надежный пароль
    - Name: Admin

---

## 🌐 6. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```env
# Appwrite Configuration
APPWRITE_PUBLIC_PROJECT_ID="ваш_project_id"
APPWRITE_PUBLIC_PROJECT_NAME="tma-catalog"
APPWRITE_PUBLIC_ENDPOINT="https://cloud.appwrite.io/v1"
APPWRITE_PUBLIC_BD_KEY="696deae40009bb04e0fc"
APPWRITE_PUBLIC_COLLECTION_CATEGORIES_ID="categories"
APPWRITE_PUBLIC_COLLECTION_PRODUCTS_ID="products"
APPWRITE_PUBLIC_BUCKET_ID="images"

# Telegram Bot Token
TELEGRAM_BOT_TOKEN="ваш_telegram_bot_token"
```

---

## 📝 7. Примеры тестовых данных

### Категория (JSON для создания через Appwrite Console):

```json
{
	"name": {
		"en": "Electronics",
		"ru": "Электроника"
	},
	"description": {
		"en": "Electronic devices and gadgets",
		"ru": "Электронные устройства и гаджеты"
	},
	"icon": "smartphone",
	"slug": "electronics",
	"sortOrder": 1,
	"isActive": true
}
```

### Товар (JSON для создания через Appwrite Console):

```json
{
	"categoryId": "ID_категории_electronics",
	"name": {
		"en": "iPhone 15 Pro",
		"ru": "iPhone 15 Pro"
	},
	"description": {
		"en": "Latest iPhone with advanced features",
		"ru": "Новейший iPhone с продвинутыми функциями"
	},
	"price": 99999,
	"priceUnit": "₽",
	"images": [],
	"slug": "iphone-15-pro",
	"features": {
		"en": ["A17 Pro chip", "Titanium design", "48MP camera"],
		"ru": ["Чип A17 Pro", "Титановый дизайн", "Камера 48МП"]
	},
	"isAvailable": true,
	"isActive": true,
	"sortOrder": 1,
	"contactMessage": {
		"en": "Contact us for more details about iPhone 15 Pro",
		"ru": "Свяжитесь с нами для получения подробностей об iPhone 15 Pro"
	}
}
```

---

## ✅ 8. Проверка настройки

1. Запустите проект: `pnpm dev`
2. Откройте админ панель: `/admin`
3. Войдите с созданными учетными данными
4. Проверьте создание/редактирование категорий и товаров

---

## 🔧 9. Дополнительные настройки

### Webhooks (опционально):

Если нужны уведомления о изменениях данных, настройте webhooks в разделе **Functions**.

### API Keys:

Для серверных операций создайте API ключ в разделе **Overview** → **Integrate**.

---

## 🚨 Важные моменты

1. **Безопасность:** Никогда не коммитьте `.env` файл в git
2. **Permissions:** Убедитесь что permissions настроены правильно
3. **Индексы:** Создайте все указанные индексы для производительности
4. **Backup:** Регулярно делайте бэкапы данных

---

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи в браузере (F12)
2. Убедитесь что все переменные окружения заполнены
3. Проверьте permissions в Appwrite Console
4. Убедитесь что Appwrite endpoint доступен
