<script setup lang="ts">
const socials = [
	{
		id: 1,
		name: 'vk',
		icon: 'i-mdi:vk',
		link: '#',
	},
	{
		id: 2,
		name: 'telegram',
		icon: 'i-ic:baseline-telegram',
		link: '#',
	},
	{
		id: 3,
		name: 'instagram',
		icon: 'i-mdi:instagram',
		link: '#',
	},
];
</script>

<template>
	<USlideover class="max-w-[320px]" title="Полезные ссылки" close-icon="i-akar-icons:cross">
		<template #body>
			<div class="flex flex-col h-full">
				<ul class="grid grid-cols-5 gap-2">
					<li v-for="item in socials" :key="item.id">
						<nuxt-link :to="item.link" target="_blank" external>
							<UIcon :name="item.icon" class="size-10" />
						</nuxt-link>
					</li>
				</ul>
				<div class="mt-auto">
					<nuxt-link to="https://t.me/beachislove" target="_blank" external title="Тыкни" class="text-[8px]">
						Разработано с любовью ❤️ - @beachislove
					</nuxt-link>
				</div>
			</div>
		</template>
	</USlideover>
</template>
