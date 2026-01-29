<script setup lang="ts">
const categories = useCategories()

// const
onMounted(() => {
	categories.fetch()
})
</script>

<template>
	<div>
		<pre>{{ categories }}</pre>
	</div>
</template>

<style scoped></style>
