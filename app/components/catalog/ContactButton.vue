<script setup lang="ts">
import type { Product } from '~/types'

interface Props {
	product: Product
}

const props = defineProps<Props>()

const { t, locale } = useI18n()
const { showAlert, showPopup, openChat, isReady } = useTelegram()

const loading = ref(false)

const openTelegramChat = async () => {
	if (!isReady.value) {
		showAlert(t('product.contact.telegram_unavailable'))
		return
	}

	loading.value = true

	try {
		const productName = props.product.name[locale.value as 'en' | 'ru']

		const buttonId = await showPopup({
			title: t('product.contact.popup_title'),
			message: t('product.contact.popup_message', { productName }),
			buttons: [
				{ id: 'open', type: 'default' as const, text: t('product.contact.open_chat') },
				{ id: 'cancel', type: 'cancel' as const, text: t('product.contact.cancel') }
			]
		})

		if (buttonId === 'open') {
			openChat(props.product.contactUsername)
		}
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
