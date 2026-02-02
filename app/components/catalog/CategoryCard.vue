<script setup lang="ts">
import type { Category } from '~/types'

interface Props {
	category: Category
	productCount?: number
}

const props = withDefaults(defineProps<Props>(), {
	productCount: 0
})

const { locale } = useI18n()

const categoryName = computed(() => props.category.name[locale.value as 'en' | 'ru'])
const categoryDescription = computed(() => props.category.description[locale.value as 'en' | 'ru'])
</script>

<template>
	<UCard
		class="category-card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
		:to="`/category/${category.slug}`"
	>
		<div class="flex items-center space-x-4">
			<div class="text-3xl shrink-0">
				{{ category.icon }}
			</div>
			<div class="flex-1 min-w-0">
				<h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
					{{ categoryName }}
				</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
					{{ categoryDescription }}
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
					{{ $t('categories.productsCount', { count: productCount }) }}
				</p>
			</div>
			<div class="shrink-0">
				<UIcon name="i-lucide-chevron-right" class="text-gray-400" />
			</div>
		</div>
	</UCard>
</template>

<style scoped>
.category-card {
	@apply border border-gray-200 dark:border-gray-700;
}

.category-card:hover {
	@apply border-gray-300 dark:border-gray-600;
}
</style>
