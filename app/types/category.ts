export interface Category {
	$id: string
	name: {
		en: string
		ru: string
	}
	description: {
		en: string
		ru: string
	}
	icon: string
	slug: string
	sortOrder: number
	isActive: boolean
	createdAt: string
	updatedAt: string
}

export interface CreateCategoryData {
	name: {
		en: string
		ru: string
	}
	description: {
		en: string
		ru: string
	}
	icon: string
	slug: string
	sortOrder?: number
	isActive?: boolean
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
	$id: string
}
