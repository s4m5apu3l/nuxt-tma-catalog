<script setup lang="ts">
const { categories, loading, fetchCategories } = useCategories()
// const { t } = useI18n()

onMounted(() => {
	fetchCategories()
})

const skeletonItems = Array.from({ length: 6 }, (_, i) => i)
</script>

<template>
	<div class="space-y-6">
		<div class="text-center space-y-2">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
				{{ $t('categories.title') }}
			</h1>
			<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
				{{ $t('categories.description') }}
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<template v-if="loading">
				<CategorySkeleton v-for="item in skeletonItems" :key="`skeleton-${item}`" />
			</template>

			<template v-else-if="categories && categories.length > 0">
				<CategoryCard
					v-for="category in categories"
					:key="category.$id"
					:category="category"
					:product-count="0"
				/>
			</template>

			<template v-else>
				<div class="col-span-full text-center py-12">
					<div class="text-6xl mb-4">📦</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						{{ $t('categories.empty.title') }}
					</h3>
					<p class="text-gray-600 dark:text-gray-400">
						{{ $t('categories.empty.description') }}
					</p>
				</div>
			</template>
		</div>
	</div>
</template>
