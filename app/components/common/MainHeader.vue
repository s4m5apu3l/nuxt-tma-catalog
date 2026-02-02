<script setup lang="ts">
const { locale, setLocale, locales } = useI18n()

const languageOptions = computed(() => 
	locales.value.map(loc => ({
		label: loc.name,
		value: loc.code,
		click: () => setLocale(loc.code)
	}))
)
</script>

<template>
	<UHeader>
		<template #title>
			<h1 class="text-lg font-semibold">TMA Catalog</h1>
		</template>

		<template #right>
			<UDropdown :items="[languageOptions]">
				<UButton 
					color="neutral" 
					variant="ghost" 
					:label="locale.toUpperCase()"
					trailing-icon="i-lucide-chevron-down"
				/>
			</UDropdown>
		</template>
	</UHeader>
</template>