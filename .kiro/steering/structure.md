# Project Structure

## Root Directory

```
/
├── app/                    # Nuxt 4 application source
├── .kiro/                  # Kiro IDE configuration
├── .nuxt/                  # Generated Nuxt files (auto-generated)
├── i18n/                   # Internationalization files
├── node_modules/           # Dependencies
├── public/                 # Static assets
├── nuxt.config.ts          # Nuxt configuration
├── package.json            # Project dependencies and scripts
└── pnpm-lock.yaml         # Lock file for pnpm
```

## App Directory Structure

```
app/
├── components/             # Vue components organized by feature
│   ├── admin/             # Admin panel components
│   ├── catalog/           # User-facing catalog components
│   └── common/            # Shared components
├── composables/           # Vue composables for business logic
├── layouts/               # Page layouts (default, admin)
├── middleware/            # Route middleware (auth, etc.)
├── pages/                 # File-based routing
│   ├── admin/            # Admin panel pages
│   ├── category/         # Category pages
│   └── product/          # Product pages
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── assets/               # Processed assets (CSS, etc.)
├── app.config.ts         # App-level configuration
└── app.vue              # Root Vue component
```

## Key Conventions

### File Naming

- **Components**: PascalCase (e.g., `CategoryCard.vue`, `ProductForm.vue`)
- **Pages**: kebab-case (e.g., `[slug].vue`, `index.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useCategories.ts`)
- **Types**: camelCase (e.g., `category.ts`, `product.ts`)
- **Utils**: camelCase (e.g., `appwrite.ts`, `format.ts`)

### Component Organization

- **admin/**: Components specific to admin panel (forms, tables, etc.)
- **catalog/**: Components for user-facing catalog (cards, galleries, etc.)
- **common/**: Shared components used across both admin and catalog

### Page Structure

- **Dynamic routes**: Use `[slug].vue` for SEO-friendly URLs
- **Admin routes**: Nested under `/admin/` directory
- **Category routes**: `/category/[slug].vue` for category pages
- **Product routes**: `/product/[slug].vue` for product details

### Composables Pattern

- **Business logic**: Encapsulated in composables (e.g., `useCategories`, `useProducts`)
- **API calls**: Handled through composables, not directly in components
- **State management**: Reactive state within composables using `ref()` and `reactive()`

### Type Definitions

- **Domain types**: Separate files for each domain (Category, Product, Admin)
- **API types**: Input/output types for Appwrite operations
- **Component props**: Defined inline or in separate interface files

### Internationalization

```
i18n/
└── locales/
    ├── en.json            # English translations
    └── ru.json            # Russian translations
```

### Environment Configuration

- **Development**: `.env` (gitignored)
- **Example**: `.env.example` (committed)
- **Runtime config**: Accessed via `useRuntimeConfig()`

## Import Conventions

- **Auto-imports**: Nuxt auto-imports composables, components, and utils
- **Explicit imports**: Use for external libraries and specific utilities
- **Type imports**: Use `import type` for TypeScript types

## Styling Approach

- **Nuxt UI**: Primary component library
- **Tailwind**: Utility classes for custom styling
- **CSS files**: Minimal custom CSS in `assets/css/`
- **Component styles**: Prefer Tailwind classes over `<style>` blocks
