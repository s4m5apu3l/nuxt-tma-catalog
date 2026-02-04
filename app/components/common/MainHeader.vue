<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { locale, setLocale, locales } = useI18n()

const currentLocale = computed(() => locales.value.find((loc) => loc.code === locale.value))

const flagIcons: Record<string, string> = {
	en: 'i-twemoji-flag-united-states',
	ru: 'i-twemoji-flag-russia'
}

const languageItems = computed<DropdownMenuItem[]>(() =>
	locales.value.map((loc) => ({
		label: loc.name,
		icon: flagIcons[loc.code] || 'i-lucide-globe',
		onSelect: () => {
			setLocale(loc.code)
		}
	}))
)
</script>

<template>
	<UHeader>
		<template #title>
			<h1 class="text-lg font-semibold">TMA Catalog</h1>
		</template>

		<template #right>
			<UDropdownMenu
				:items="languageItems"
				:content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
				:ui="{ content: 'w-48' }"
			>
				<UButton
					color="neutral"
					variant="ghost"
					:label="currentLocale?.name || locale.toUpperCase()"
					:leading-icon="flagIcons[currentLocale?.code || locale] || 'i-lucide-globe'"
					trailing-icon="i-lucide-chevron-down"
				/>
			</UDropdownMenu>
		</template>
	</UHeader>
</template>
