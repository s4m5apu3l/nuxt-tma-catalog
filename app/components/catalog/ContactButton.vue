<script setup lang="ts">
import type { Product } from '~/types'

interface Props {
	product: Product
}

const props = defineProps<Props>()

const { t, locale } = useI18n()
const { openTelegramLink, showAlert, isReady } = useTelegram()

const loading = ref(false)

const openTelegramChat = async () => {
	if (!isReady.value) {
		showAlert(t('product.contact.telegram_unavailable'))
		return
	}

	loading.value = true

	try {
		const productName = props.product.name[locale.value as 'en' | 'ru']
		const price = formatPricing(props.product.pricing, locale.value)
		const customMessage = props.product.contactMessage?.[locale.value as 'en' | 'ru']

		const baseMessage =
			customMessage ||
			t('product.contact.default_message', {
				productName,
				price
			})

		const productUrl = `${window.location.origin}/product/${props.product.slug}`
		const fullMessage = `${baseMessage}\n\n${t('product.contact.link')}: ${productUrl}`

		const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(fullMessage)}`

		openTelegramLink(telegramUrl)
	} catch (error) {
		console.error('Error opening Telegram chat:', error)
		showAlert(t('common.error'))
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<UButton
		:loading="loading"
		color="primary"
		size="lg"
		block
		icon="i-lucide-message-circle"
		class="font-semibold"
		@click="openTelegramChat"
	>
		{{ t('product.contact.button') }}
	</UButton>
</template>
