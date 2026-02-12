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
			<p class="text-sm text-muted">Built with FrostByte • © {{ new Date().getFullYear() }}</p>
		</UFooter>
	</div>
</template>
