<script setup lang="ts">
const links = [
	{
		id: 1,
		name: 'Карта',
		to: '/map',
		icon: 'material-symbols:map-rounded',
	},
	{
		id: 2,
		name: 'Моторки',
		to: '/boats',
		icon: 'tabler:speedboat-filled',
	},
	{
		id: 1,
		name: 'Прайс',
		to: '/price',
		icon: 'solar:tag-price-bold',
	},
];
</script>

<template>
	<nav class="fixed bottom-[8px] right-0 left-0 w-full">
		<ul class="flex items-center gap-4 justify-center bg-zinc-100 dark:bg-zinc-700 rounded-4xl shadow p-2 max-w-[320px] mx-auto">
			<li v-for="link in links" :key="link.id">
				<nuxt-link
					:to="link.to"
					class="hover:text-amber-500 transition-colors flex flex-col gap-1 items-center"
					:class="useRoute().path === link.to ? 'text-amber-600' : ''"
				>
					<Icon :name="link.icon" />
					<span class="text-[14px]">
						{{ link.name }}
					</span>
				</nuxt-link>
			</li>
		</ul>
	</nav>
</template>
