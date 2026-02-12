<script setup lang="ts">
import { useViewport } from 'vue-tg'
// const title = 'TMA Catalog'
// const description = 'A minimal, production-ready catalog system for browsing products and categories.'

// useSeoMeta({
// 	title,
// 	description,
// 	ogTitle: title,
// 	ogDescription: description,
// 	twitterCard: 'summary_large_image'
// })

// useHead({
// 	meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
// 	link: [{ rel: 'icon', href: '/favicon.ico' }]
// })

onBeforeMount(() => {
	useViewport().expand()
})
</script>

<template>
	<UApp>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
