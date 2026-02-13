# TMA Catalog - Telegram Mini App

Modern rental catalog built as a Telegram Mini App with admin panel for managing products and categories.

## Features

- 📱 Telegram Mini App integration
- 🎨 Modern UI with Nuxt UI v4
- 🌍 Multi-language support (EN/RU)
- 🖼️ Automatic image compression before upload
- 💰 Multiple pricing options per product
- 🔐 Admin panel with authentication
- ⚡ Optimized API requests with caching
- 📦 Product availability tracking

## Tech Stack

- **Framework**: Nuxt 4 (SPA mode)
- **UI**: Nuxt UI v4 + Tailwind CSS
- **Backend**: Appwrite (Database, Storage, Auth)
- **Telegram**: vue-tg for WebApp API
- **i18n**: Multi-language support

## Setup

Install dependencies:

```bash
npm install
```

Configure environment variables (copy `.env.example` to `.env`):

```env
NUXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NUXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NUXT_PUBLIC_APPWRITE_BD_KEY=your_database_id
NUXT_PUBLIC_APPWRITE_COLLECTION_CATEGORIES=categories_collection_id
NUXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS=products_collection_id
NUXT_PUBLIC_APPWRITE_BUCKET_ID=storage_bucket_id
NUXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
```

## Development

Start development server:

```bash
npm run dev
```

Access at `http://localhost:3000`

## Production

Build for production (static site):

```bash
npm run generate
```

Preview production build:

```bash
npm run preview
```

Deploy the `.output/public` directory to your hosting (GitHub Pages, Netlify, etc.)

## Project Structure

```
app/
├── components/       # Vue components
│   ├── admin/       # Admin panel components
│   ├── catalog/     # User-facing components
│   └── common/      # Shared components
├── composables/     # Vue composables
├── pages/           # File-based routing
├── types/           # TypeScript types
└── utils/           # Utility functions

i18n/locales/        # Translation files
docs/                # Documentation
```

## Key Features

### Image Compression

Images are automatically compressed before upload:

- Converts to WebP format
- Max resolution: 1920x1920px
- Quality: 85%
- Saves 60-80% bandwidth

### API Optimization

- Global state caching (5 min)
- Client-side filtering
- Parallel data loading
- Minimal API requests

### Admin Panel

- Category management
- Product CRUD operations
- Multiple pricing options
- Image upload with compression
- Availability tracking

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run generate     # Generate static site
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript checks
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Check formatting
npm run format:fix   # Fix formatting
```

## License

MIT
