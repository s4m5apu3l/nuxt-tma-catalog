<script setup>
const { locale } = useI18n()

useHead({
	meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
	link: [{ rel: 'icon', href: '/favicon.ico' }],
	htmlAttrs: {
		lang: locale
	}
})

const title = 'TMA Catalog'
const description = 'A minimal, production-ready catalog system for browsing products and categories.'

useSeoMeta({
	title,
	description,
	ogTitle: title,
	ogDescription: description,
	twitterCard: 'summary_large_image'
})
</script>

<template>
	<UApp>
		<UHeader>
			<template #left>
				<NuxtLink to="/">
					<AppLogo class="w-auto h-6 shrink-0" />
				</NuxtLink>

				<TemplateMenu />
			</template>

			<template #right>
				<LanguageSwitcher />
				
				<UColorModeButton />

				<UButton
					to="https://github.com/nuxt-ui-templates/starter"
					target="_blank"
					icon="i-simple-icons-github"
					aria-label="GitHub"
					color="neutral"
					variant="ghost"
				/>
			</template>
		</UHeader>

		<UMain>
			<NuxtPage />
		</UMain>

		<USeparator icon="i-simple-icons-nuxtdotjs" />

		<UFooter>
			<template #left>
				<p class="text-sm text-muted">Built with Nuxt UI • © {{ new Date().getFullYear() }}</p>
			</template>

			<template #right>
				<UButton
					to="https://github.com/nuxt-ui-templates/starter"
					target="_blank"
					icon="i-simple-icons-github"
					aria-label="GitHub"
					color="neutral"
					variant="ghost"
				/>
			</template>
		</UFooter>
	</UApp>
</template>
