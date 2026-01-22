<template>
	<UDropdown :items="languageItems" :popper="{ placement: 'bottom-end' }">
		<UButton
			:label="currentLanguage.name"
			trailing-icon="i-lucide-chevron-down"
			color="gray"
			variant="ghost"
			size="sm"
		/>
	</UDropdown>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLanguage = computed(() => {
	return locales.value.find((l) => l.code === locale.value) || locales.value[0]
})

const languageItems = computed(() => [
	locales.value.map((lang) => ({
		label: lang.name,
		click: () => switchLanguage(lang.code)
	}))
])

const switchLanguage = async (langCode: string) => {
	await setLocale(langCode)
}
</script>
