<script setup lang="ts">
import { SlideOver } from '#components';

const colorMode = useColorMode();
const slideover = useSlideover();

const isDark = computed({
	get() {
		return colorMode.value === 'dark';
	},
	set() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
	},
});

function openSlideover() {
	slideover.open(SlideOver, { title: 'Полезные ссылки' });
}
</script>

<template>
	<header class="border-b border-zinc-300 dark:border-zinc-700">
		<div class="l-wrapper">
			<div class="flex items-center justify-between gap-4 py-4">
				<nuxt-link to="/" class="flex">
					<UIcon name="i-logos:nuxt-icon" class="size-10" />
				</nuxt-link>

				<div class="flex items-center gap-1">
					<UInput icon="i-lucide-search" size="md" variant="outline" placeholder="Поиск..." />
					<UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost" @click="isDark = !isDark" />
					<button class="flex" @click="openSlideover">
						<UIcon name="i-prime:align-justify" class="size-7" />
					</button>
				</div>
			</div>
		</div>
	</header>
</template>
