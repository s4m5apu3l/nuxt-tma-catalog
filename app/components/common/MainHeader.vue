<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const { locale, setLocale, locales } = useI18n()
const { t } = useI18n()
const route = useRoute()

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

const navigationItems = computed<NavigationMenuItem[]>(() => [
	{
		label: t('nav.catalog'),
		to: '/',
		icon: 'i-lucide-home',
		active: route.path === '/'
	}
])
</script>

<template>
	<UHeader :toggle="false">
		<template #title>
			<h1 class="text-lg font-semibold">TMA Catalog</h1>
		</template>

		<template #right>
			<UDropdownMenu
				:items="languageItems"
				:content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
				:ui="{ content: '' }"
			>
				<UButton
					color="neutral"
					variant="ghost"
					:leading-icon="flagIcons[currentLocale?.code || locale] || 'i-lucide-globe'"
					trailing-icon="i-lucide-chevron-down"
				/>
			</UDropdownMenu>
		</template>

		<template #body>
			<div class="space-y-4 p-4">
				<UNavigationMenu :items="navigationItems" orientation="vertical" class="-mx-2.5" />

				<USeparator />

				<!-- <div class="space-y-2">
					<p class="text-sm font-medium text-gray-700 dark:text-gray-300 px-2.5">
						{{ $t('nav.language') }}
					</p>
					<div class="flex flex-col gap-1">
						<UButton
							v-for="loc in locales"
							:key="loc.code"
							color="neutral"
							
							variant="ghost"
							:leading-icon="flagIcons[loc.code] || 'i-lucide-globe'"
							:class="{ 'bg-gray-100 dark:bg-gray-800': locale === loc.code }"
							class="justify-start"
							@click="setLocale(loc.code)"
						/>
					</div>
				</div> -->
			</div>
		</template>
	</UHeader>
</template>
