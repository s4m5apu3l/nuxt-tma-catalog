// Популярные иконки Lucide для категорий
export const popularCategoryIcons = [
	// Транспорт
	{ name: 'car', label: 'Автомобиль', category: 'transport' },
	{ name: 'bike', label: 'Велосипед/Мотоцикл', category: 'transport' },
	{ name: 'plane', label: 'Самолет', category: 'transport' },
	{ name: 'ship', label: 'Корабль', category: 'transport' },
	{ name: 'truck', label: 'Грузовик', category: 'transport' },
	
	// Недвижимость
	{ name: 'home', label: 'Дом', category: 'property' },
	{ name: 'building', label: 'Здание', category: 'property' },
	{ name: 'building-2', label: 'Офисное здание', category: 'property' },
	{ name: 'warehouse', label: 'Склад', category: 'property' },
	
	// Электроника
	{ name: 'smartphone', label: 'Смартфон', category: 'electronics' },
	{ name: 'laptop', label: 'Ноутбук', category: 'electronics' },
	{ name: 'tv', label: 'Телевизор', category: 'electronics' },
	{ name: 'camera', label: 'Камера', category: 'electronics' },
	{ name: 'headphones', label: 'Наушники', category: 'electronics' },
	
	// Спорт и отдых
	{ name: 'dumbbell', label: 'Спорт', category: 'sports' },
	{ name: 'gamepad-2', label: 'Игры', category: 'sports' },
	{ name: 'music', label: 'Музыка', category: 'sports' },
	{ name: 'tent', label: 'Кемпинг', category: 'sports' },
	
	// Инструменты
	{ name: 'wrench', label: 'Инструменты', category: 'tools' },
	{ name: 'hammer', label: 'Молоток', category: 'tools' },
	{ name: 'drill', label: 'Дрель', category: 'tools' },
	
	// Общие
	{ name: 'package', label: 'Посылка', category: 'general' },
	{ name: 'shopping-bag', label: 'Покупки', category: 'general' },
	{ name: 'gift', label: 'Подарок', category: 'general' },
	{ name: 'star', label: 'Звезда', category: 'general' },
	{ name: 'heart', label: 'Сердце', category: 'general' },
	{ name: 'zap', label: 'Молния', category: 'general' }
]

export const iconCategories = [
	{ key: 'transport', label: 'Транспорт' },
	{ key: 'property', label: 'Недвижимость' },
	{ key: 'electronics', label: 'Электроника' },
	{ key: 'sports', label: 'Спорт и отдых' },
	{ key: 'tools', label: 'Инструменты' },
	{ key: 'general', label: 'Общие' }
]

/**
 * Получить полное имя иконки с префиксом i-lucide-
 */
export const getIconName = (iconName: string): string => {
	if (iconName.startsWith('i-lucide-')) {
		return iconName
	}
	return `i-lucide-${iconName}`
}

/**
 * Получить иконки по категории
 */
export const getIconsByCategory = (category: string) => {
	return popularCategoryIcons.filter(icon => icon.category === category)
}

/**
 * Найти иконку по названию
 */
export const findIcon = (searchTerm: string) => {
	const term = searchTerm.toLowerCase()
	return popularCategoryIcons.filter(icon => 
		icon.name.toLowerCase().includes(term) || 
		icon.label.toLowerCase().includes(term)
	)
}

/**
 * Проверить, существует ли иконка в списке популярных
 */
export const isValidIcon = (iconName: string): boolean => {
	const cleanName = iconName.replace('i-lucide-', '')
	return popularCategoryIcons.some(icon => icon.name === cleanName)
}