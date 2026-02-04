# Technology Stack

## Framework & Runtime
- **Nuxt 4**: Vue.js meta-framework with SSR disabled (SPA mode)
- **Vue 3**: Frontend framework with Composition API
- **TypeScript**: Type-safe development
- **Node.js**: Runtime environment

## UI & Styling
- **Nuxt UI v4**: Component library built on Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework
- **Iconify**: Icon system with Lucide and Simple Icons collections
- **Telegram WebApp**: Native Telegram styling integration

## Backend & Database
- **Appwrite**: Backend-as-a-Service for database, storage, and authentication
- **Collections**: Categories, Products, AdminUsers
- **Storage**: Product images with 5MB limit, supports JPG/PNG/WebP

## Telegram Integration
- **vue-tg**: Vue composables for Telegram WebApp API
- **Telegram Bot API**: For direct messaging functionality
- **WebApp initData**: User authentication and validation

## Development Tools
- **ESLint**: Code linting with Prettier integration
- **Prettier**: Code formatting
- **npm run**: Package manager (preferred over npm/yarn)
- **TypeScript**: Static type checking

## Internationalization
- **@nuxtjs/i18n**: Multi-language support (EN/RU)
- **Strategy**: no_prefix with Russian as default locale

## Common Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
```

### Production
```bash
npm run generate     # Build static site for GitHub Pages deployment
npm run preview      # Preview production build locally
npm run build        # Build for production (SSR mode)
```

### Code Quality
```bash
npm run format       # Check code formatting with Prettier
npm run format:fix   # Fix formatting issues automatically
```

## Deployment
- **Target**: GitHub Pages static hosting
- **Build**: Static site generation (SSG) with `nuxt generate`
- **Base URL**: `/nuxt-tma-catalog/` for GitHub Pages subdirectory