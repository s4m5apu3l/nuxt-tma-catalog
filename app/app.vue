<script setup lang="ts">
const { isTelegramWebApp } = useTelegram()
const { t } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()

// Check if current route is admin (admin routes don't require Telegram)
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Show fallback only for non-admin routes when not in Telegram
const showTelegramFallback = computed(() => {
	if (!import.meta.client) return false
	if (isAdminRoute.value) return false
	return !isTelegramWebApp.value
})

const botUrl = computed(() => {
	const username = config.public.telegramBotUsername
	return username ? `https://t.me/${username}` : 'https://t.me'
})
</script>

<template>
	<UApp>
		<!-- Telegram-only fallback for catalog pages -->
		<div
			v-if="showTelegramFallback"
			class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6"
		>
			<div class="text-center max-w-md">
				<div class="text-8xl mb-6">🔒</div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					{{ t('error.telegramOnly.title') }}
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mb-8">
					{{ t('error.telegramOnly.description') }}
				</p>
				<a
					:href="botUrl"
					target="_blank"
					class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
				>
					<UIcon name="i-simple-icons-telegram" class="w-5 h-5" />
					{{ t('error.telegramOnly.openBot') }}
				</a>
			</div>
		</div>

		<!-- Normal app content -->
		<NuxtLayout v-else>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
