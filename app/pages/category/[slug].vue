<script setup lang="ts">
definePageMeta({
	validate: async (route) => {
		return typeof route.params.slug === 'string' && isNaN(parseInt(route.params.slug, 10));
	},
});
const route = useRoute();
// $fetch(`/api/products?category=${route.params.slug}`)
const { data: products, status } = useAsyncData(`${route.params.slug}`, async () => {
	return await $fetch(`/api/products`);
});
</script>

<template>
	<section class="py-4">
		<main-categories />
		<section class="l-wrapper !mt-4">
			<product-list :status="status">
				<pre>{{ products }}</pre>
				<!-- <product-card /> -->
			</product-list>
		</section>
	</section>
</template>
