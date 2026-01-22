<template>
	<UAlert
		v-if="error"
		icon="i-lucide-alert-circle"
		color="error"
		variant="subtle"
		:title="title || $t('common.error')"
		:description="error"
		:class="alertClass"
	>
		<template #actions>
			<div class="flex gap-2">
				<!-- Retry Button -->
				<UButton
					v-if="showRetry"
					color="error"
					variant="ghost"
					size="xs"
					icon="i-lucide-refresh-cw"
					:loading="retrying"
					:disabled="retrying"
					@click="handleRetry"
				>
					{{ $t('common.retry') }}
				</UButton>

				<!-- Dismiss Button -->
				<UButton
					v-if="showDismiss"
					color="error"
					variant="ghost"
					size="xs"
					icon="i-lucide-x"
					@click="handleDismiss"
				>
					{{ $t('common.dismiss') }}
				</UButton>

				<!-- Custom Actions Slot -->
				<slot name="actions" />
			</div>
		</template>
	</UAlert>
</template>

<script setup lang="ts">
interface Props {
	error: string | null
	title?: string
	showRetry?: boolean
	showDismiss?: boolean
	onRetry?: () => void | Promise<void>
	onDismiss?: () => void
	class?: string
}

const props = withDefaults(defineProps<Props>(), {
	showRetry: true,
	showDismiss: true
})

const emit = defineEmits<{
	retry: []
	dismiss: []
}>()

// State
const retrying = ref(false)

// Computed
const alertClass = computed(() => {
	const classes = ['mb-6']
	if (props.class) {
		classes.push(props.class)
	}
	return classes.join(' ')
})

// Handlers
const handleRetry = async () => {
	if (retrying.value) return

	retrying.value = true

	try {
		if (props.onRetry) {
			await props.onRetry()
		}
		emit('retry')
	} catch (error) {
		console.error('Retry failed:', error)
	} finally {
		retrying.value = false
	}
}

const handleDismiss = () => {
	if (props.onDismiss) {
		props.onDismiss()
	}
	emit('dismiss')
}
</script>
