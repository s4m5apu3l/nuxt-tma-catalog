export interface Product {
	$id: string
	categoryId: string
	name: {
		en: string
		ru: string
	}
	description: {
		en: string
		ru: string
	}
	price: number
	priceUnit: string
	images: string[]
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
	}
	createdAt: string
	updatedAt: string
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
	price: number
	priceUnit: string
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
