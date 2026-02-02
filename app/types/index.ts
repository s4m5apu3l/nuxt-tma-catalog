// Export all types from a central location
export type { Category, CreateCategoryData, UpdateCategoryData } from './category'
export type { Product, CreateProductData, UpdateProductData } from './product'
export type { AdminUser, LoginCredentials, AdminSession } from './admin'

// Common types
export interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: string
}

export interface PaginatedResponse<T> {
	documents: T[]
	total: number
}

export interface LocalizedContent {
	en: string
	ru: string
}

export type Locale = 'en' | 'ru'
