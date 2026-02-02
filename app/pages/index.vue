<script setup lang="ts">
const categories = useCategories()

// const
onMounted(() => {
	categories.fetch()
})
const imgSrc = computed(() => {
	const firstCategory = categories.current.value?.[0]
	if (!firstCategory?.imgId) return null
	return `https://sgp.cloud.appwrite.io/v1/storage/buckets/698025b600277146b491/files/${firstCategory.imgId}/view?project=696740db00155c53ebd1`
})
</script>

<template>
	<div>
		<pre>{{ categories }}</pre>
		<img v-if="imgSrc" :src="imgSrc" />
	</div>
</template>

<style scoped></style>
