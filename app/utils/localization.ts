/**
 * Получить локализованную строку из объекта или JSON строки
 */
export const getLocalizedString = (
	value: string | { en: string; ru: string } | null | undefined,
	locale: string,
	fallback = 'Unnamed'
): string => {
	if (!value) return fallback

	// Если это уже объект
	if (typeof value === 'object' && value !== null) {
		return value[locale as 'en' | 'ru'] || value.en || value.ru || fallback
	}

	// Если это JSON строка
	if (typeof value === 'string') {
		try {
			const parsed = JSON.parse(value)
			if (typeof parsed === 'object' && parsed !== null) {
				return parsed[locale as 'en' | 'ru'] || parsed.en || parsed.ru || fallback
			}
			return value
		} catch {
			return value
		}
	}

	return String(value || fallback)
}

/**
 * Получить название категории с учетом локализации
 */
export const getCategoryName = (
	category: { name: string | { en: string; ru: string } },
	locale: string
): string => {
	return getLocalizedString(category.name, locale, 'Unnamed Category')
}

/**
 * Получить название продукта с учетом локализации
 */
export const getProductName = (
	product: { name: string | { en: string; ru: string } },
	locale: string
): string => {
	return getLocalizedString(product.name, locale, 'Unnamed Product')
}

/**
 * Получить описание с учетом локализации
 */
export const getLocalizedDescription = (
	description: string | { en: string; ru: string } | null | undefined,
	locale: string
): string => {
	return getLocalizedString(description, locale, '')
}