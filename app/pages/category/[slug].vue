<script setup lang="ts">
definePageMeta({
	validate: async (route) => {
		return typeof route.params.slug === 'string' && isNaN(parseInt(route.params.slug, 10));
	},
});
</script>

<template>
	<section class="l-wrapper">
		<div class="py-4">
			<main-categories />

			<section class="mt-4">
				<main-product-list />
			</section>
		</div>
	</section>
</template>
