<script setup lang="ts"></script>

<template>
	<section class="layout">
		<main-header />

		<main class="content">
			<slot />
		</main>

		<cart-footer-button />
	</section>
</template>

<style scoped>
.layout {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.content {
	flex: 1;
}
</style>
