export interface Category {
	readonly $id: string
	readonly name: {
		readonly en: string
		readonly ru: string
	}
	readonly description: {
		readonly en: string
		readonly ru: string
	}
	readonly icon: string
	readonly slug: string
	readonly sortOrder: number
	readonly isActive: boolean
	readonly createdAt: string
	readonly updatedAt: string
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
