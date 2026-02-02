<script setup lang="ts">
const { categories, fetchCategories } = useCategories()

onMounted(() => {
	fetchCategories()
})
</script>

<template>
	<div>
		<h1>TMA Catalog</h1>
		<div v-if="categories">
			<div v-for="category in categories" :key="category.$id" class="mb-4">
				<h2>{{ category.name.en }}</h2>
				<p>{{ category.description.en }}</p>
			</div>
		</div>
		<div v-else>
			Loading categories...
		</div>
	</div>
</template>

<style scoped></style>
