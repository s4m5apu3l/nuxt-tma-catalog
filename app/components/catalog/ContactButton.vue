<script setup lang="ts">
import type { Product } from '~/types'

interface Props {
	product: Product
}

const props = defineProps<Props>()
const { locale } = useI18n()

const isLoading = ref(false)

const productName = computed(() => props.product.name[locale.value as 'en' | 'ru'])
const contactMessage = computed(() => {
	const customMessage = props.product.contactMessage[locale.value as 'en' | 'ru']
	if (customMessage && customMessage.trim()) {
		return customMessage
	}

	return `Hi! I'm interested in "${productName.value}" (${props.product.price} ${props.product.priceUnit}). Could you please provide more details?`
})

const openTelegramChat = async () => {
	isLoading.value = true

	try {
		// Check if we're in Telegram WebApp
		if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
			const webApp = window.Telegram.WebApp

			// Create the message with product details
			const message = encodeURIComponent(contactMessage.value)

			// Try to open Telegram link
			const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${message}`

			// Use WebApp method if available
			if (webApp.openTelegramLink) {
				webApp.openTelegramLink(telegramUrl)
			} else {
				// Fallback to window.open
				window.open(telegramUrl, '_blank')
			}
		} else {
			// Fallback for non-Telegram environments
			const message = encodeURIComponent(contactMessage.value)
			const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${message}`
			window.open(telegramUrl, '_blank')
		}
	} catch (error) {
		console.error('Error opening Telegram chat:', error)

		// Show error message to user
		const toast = useToast()
		toast.add({
			title: 'Error',
			description: 'Unable to open Telegram chat. Please try again.',
			color: 'error'
		})
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<UButton
		:loading="isLoading"
		:disabled="isLoading"
		color="primary"
		size="lg"
		block
		icon="i-lucide-message-circle"
		class="contact-button"
		@click="openTelegramChat"
	>
		<span v-if="!isLoading">
			{{ $t('product.contact') }}
		</span>
		<span v-else>
			{{ $t('product.contacting') }}
		</span>
	</UButton>
</template>

<style scoped>
.contact-button {
	@apply font-semibold;
}
</style>
