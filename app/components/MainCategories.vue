<script setup lang="ts">
const itemsArray = [
	{
		id: 1,
		title: 'Все',
		slug: 'all',
	},
	{
		id: 2,
		title: 'Одежда',
		slug: 'clothes',
	},
	{
		id: 3,
		title: 'Обувь',
		slug: 'shoes',
	},
	{
		id: 4,
		title: 'Аксессуары',
		slug: 'accessories',
	},
];
</script>

<template>
	<UCarousel v-slot="{ item }" :items="itemsArray" class="" :ui="{ item: 'basis-auto', container: 'first:pl-3 last:pr-3' }">
		<nuxt-link :to="'/category/' + item.slug">
			<UBadge
				:color="$route.params.slug === item.slug ? 'primary' : 'neutral'"
				:variant="$route.params.slug === item.slug ? 'solid' : 'outline'"
			>
				{{ item.title }}
			</UBadge>
		</nuxt-link>
	</UCarousel>
</template>
