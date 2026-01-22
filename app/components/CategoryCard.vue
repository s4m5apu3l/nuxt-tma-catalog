<template>
	<UCard class="hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateToCategory">
		<template #header>
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					{{ category.name }}
				</h3>
				<UIcon
					name="i-lucide-arrow-right"
					class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
				/>
			</div>
		</template>

		<div class="text-sm text-gray-600 dark:text-gray-400">
			<p>{{ $t('category.viewProducts') }}</p>
		</div>
	</UCard>
</template>

<script setup lang="ts">
interface Category {
	$id: string
	name: string
	slug: string
	$createdAt: string
	$updatedAt: string
}

interface Props {
	category: Category
}

const props = defineProps<Props>()

const navigateToCategory = () => {
	navigateTo(`/category/${props.category.$id}`)
}
</script>
