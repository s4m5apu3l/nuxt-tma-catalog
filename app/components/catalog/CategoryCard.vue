<script setup lang="ts">
import type { Category } from '~/types'
import { getCategoryName } from '~/utils/localization'

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

const categoryName = computed(() => getCategoryName(props.category, locale.value))

const iconName = computed(() => {
	const icon = props.category.icon

	// Если иконка уже содержит префикс i-lucide-, используем как есть
	if (icon?.startsWith('i-lucide-')) {
		return icon
	}

	// Если иконка без префикса, добавляем i-lucide-
	if (icon) {
		return `i-lucide-${icon}`
	}

	// Fallback иконка
	return 'i-lucide-package'
})
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
