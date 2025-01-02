<script setup lang="ts"></script>

<template>
	<section class="layout">
		<header>header</header>
		<main class="content">
			<slot />
		</main>
		<footer>footer</footer>
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
