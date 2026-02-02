<script setup>
const { locale } = useI18n()

useHead({
	htmlAttrs: {
		lang: locale
	}
})
</script>

<template>
	<div class="min-h-screen bg-background">
		<MainHeader />

		<UMain>
			<UContainer class="py-8">
				<slot />
			</UContainer>
		</UMain>

		<USeparator />

		<UFooter>
			<template #left>
				<p class="text-sm text-muted">Built with FrostByte • © {{ new Date().getFullYear() }}</p>
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
	</div>
</template>
