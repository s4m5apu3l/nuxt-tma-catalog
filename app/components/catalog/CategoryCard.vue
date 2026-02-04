<script setup lang="ts">
import type { Category } from '~/types'

interface Props {
	category: Category
	productCount?: number
}

const props = withDefaults(defineProps<Props>(), {
	productCount: 0
})

interface Emits {
	select: [category: Category]
}

const emit = defineEmits<Emits>()

const { locale } = useI18n()

const categoryName = computed(() => {
	let name = props.category.name

	if (typeof name === 'string') {
		try {
			name = JSON.parse(name)
		} catch {
			return name
		}
	}

	// Если name это объект с локализацией
	if (typeof name === 'object' && name !== null) {
		return name[locale.value as 'en' | 'ru'] || name.en || name.ru || 'Unnamed Category'
	}

	return String(name || 'Unnamed Category')
})

const iconMap: Record<string, string> = {
	smartphone: 'i-lucide-smartphone',
	shirt: 'i-lucide-shirt',
	electronics: 'i-lucide-zap',
	fashion: 'i-lucide-shirt',
	home: 'i-lucide-home',
	books: 'i-lucide-book',
	sports: 'i-lucide-dumbbell',
	food: 'i-lucide-utensils',
	beauty: 'i-lucide-sparkles',
	toys: 'i-lucide-gamepad-2',
	automotive: 'i-lucide-car',
	health: 'i-lucide-heart-pulse'
}

const iconName = computed(() => iconMap[props.category.icon] || 'i-lucide-package')
</script>

<template>
	<div
		class="flex flex-col items-center p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-w-[80px]"
		@click="emit('select', category)"
	>
		<div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
			<UIcon :name="iconName" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
		</div>
		<span class="text-xs text-center text-gray-700 dark:text-gray-300 font-medium leading-tight">
			{{ categoryName }}
		</span>
	</div>
</template>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
