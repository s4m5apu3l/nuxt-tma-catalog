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
				<template v-for="product in products" :key="product.id">
					<product-card :data="product" />
				</template>
			</product-list>
		</section>
	</section>
</template>
