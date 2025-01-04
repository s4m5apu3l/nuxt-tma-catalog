<script setup lang="ts">
definePageMeta({
	validate: async (route) => {
		return typeof route.params.slug === 'string' && isNaN(parseInt(route.params.slug, 10));
	},
});

// const {data: }
</script>

<template>
	<section class="py-4">
		<main-categories />
		<section class="l-wrapper !mt-4">
			<product-list>
				<product-card />
			</product-list>
		</section>
	</section>
</template>
