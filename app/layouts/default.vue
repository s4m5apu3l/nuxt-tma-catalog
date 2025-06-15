<script setup lang="ts"></script>

<template>
	<section class="layout">
		<main-header />

		<main class="content">
			<slot />
		</main>

		<main-nav />
	</section>
</template>

<style scoped>
.layout {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	margin-bottom: 64px;
	overflow-x: clip;
}

.content {
	flex: 1;
}
</style>
