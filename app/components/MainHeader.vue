<script setup lang="ts">
import { LazySlideOver } from '#components';

const colorMode = useColorMode();
const overlay = useOverlay();

const isDark = computed({
	get() {
		return colorMode.value === 'dark';
	},
	set() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
	},
});

const slideover = overlay.create(LazySlideOver);

async function openSlideover() {
	slideover.open();
}
</script>

<template>
	<header class="py-2 bg-zinc-100 dark:bg-zinc-700 shadow">
		<div class="l-wrapper">
			<div class="flex items-center gap-2 justify-between">
				<nuxt-link to="/" class="">
					<Icon name="logos:airbnb" size="32" />
				</nuxt-link>
				<nav class="flex gap-1 items-center">
					<UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost" @click="isDark = !isDark" />
					<button class="flex" @click="openSlideover">
						<UIcon name="i-prime:align-justify" class="size-7" />
					</button>
				</nav>
			</div>
		</div>
	</header>
</template>

<style scoped></style>
