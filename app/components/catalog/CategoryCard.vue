<script setup lang="ts">
import type { Category } from '~/types'

interface Props {
	category: Category
	productCount?: number
}

const props = withDefaults(defineProps<Props>(), {
	productCount: 0
})

const { locale, t } = useI18n()

const categoryName = computed(() => {
	const name = props.category.name
	if (typeof name === 'object' && name !== null) {
		return name[locale.value as 'en' | 'ru'] || name.en || name.ru || 'Unnamed Category'
	}
	return String(name || 'Unnamed Category')
})

const categoryDescription = computed(() => {
	const desc = props.category.description
	if (typeof desc === 'object' && desc !== null) {
		return desc[locale.value as 'en' | 'ru'] || desc.en || desc.ru || 'No description'
	}
	return String(desc || 'No description')
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
	<UCard class="group hover:shadow-lg transition-all duration-200 cursor-pointer">
		<NuxtLink :to="`/category/${category.slug}`" class="block p-6">
			<div class="flex items-start gap-4">
				<div class="shrink-0 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
					<UIcon :name="iconName" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
				</div>

				<div class="flex-1 min-w-0">
					<h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
						{{ categoryName }}
					</h3>

					<p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
						{{ categoryDescription }}
					</p>

					<div class="flex items-center justify-between">
						<div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
							<UIcon name="i-lucide-package" class="w-4 h-4" />
							<span>{{ productCount }} {{ t('categories.products') }}</span>
						</div>

						<UIcon
							name="i-lucide-arrow-right"
							class="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform duration-200"
						/>
					</div>
				</div>
			</div>
		</NuxtLink>
	</UCard>
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
