export type PricePeriod = 'hour' | 'day' | 'week' | 'month'

export interface PricingOption {
	period: PricePeriod
	price: number
}

export interface Product {
	readonly $id: string
	readonly categoryId: string
	readonly name: {
		readonly en: string
		readonly ru: string
	}
	readonly description: {
		readonly en: string
		readonly ru: string
	}
	readonly pricing: readonly PricingOption[]
	readonly images: readonly string[]
	readonly slug: string
	readonly features: {
		readonly en: readonly string[]
		readonly ru: readonly string[]
	}
	readonly isAvailable: boolean
	readonly isActive: boolean
	readonly sortOrder: number
	readonly contactMessage: {
		readonly en: string
		readonly ru: string
	}
	readonly createdAt: string
	readonly updatedAt: string
}

export interface CreateProductData {
	categoryId: string
	name: {
		en: string
		ru: string
	}
	description: {
		en: string
		ru: string
	}
	pricing: PricingOption[]
	images?: string[]
	slug: string
	features?: {
		en: string[]
		ru: string[]
	}
	isAvailable?: boolean
	isActive?: boolean
	sortOrder?: number
	contactMessage?: {
		en: string
		ru: string
	}
}

export interface UpdateProductData extends Partial<CreateProductData> {
	$id: string
}
