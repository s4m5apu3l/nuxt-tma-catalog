<template>
	<div>
		<slot v-if="!hasError" />

		<!-- Error Fallback UI -->
		<div v-else class="min-h-[200px] flex flex-col items-center justify-center p-8 text-center">
			<UIcon name="i-lucide-alert-triangle" class="w-16 h-16 text-red-500 mb-4" />

			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
				{{ title || $t('error.boundary.title') }}
			</h3>

			<p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
				{{ description || $t('error.boundary.description') }}
			</p>

			<div class="flex flex-col sm:flex-row gap-3">
				<UButton color="red" variant="outline" icon="i-lucide-refresh-cw" @click="retry">
					{{ $t('common.retry') }}
				</UButton>

				<UButton v-if="showReportButton" variant="ghost" icon="i-lucide-bug" @click="reportError">
					{{ $t('error.boundary.report') }}
				</UButton>
			</div>

			<!-- Error Details (Development Only) -->
			<details v-if="isDevelopment && errorDetails" class="mt-6 w-full max-w-2xl">
				<summary
					class="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					{{ $t('error.boundary.showDetails') }}
				</summary>
				<pre class="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-left overflow-auto">{{
					errorDetails
				}}</pre>
			</details>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	title?: string
	description?: string
	showReportButton?: boolean
	onRetry?: () => void | Promise<void>
	onReport?: (error: Error) => void | Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
	showReportButton: false
})

const emit = defineEmits<{
	error: [error: Error]
	retry: []
}>()

// State
const hasError = ref(false)
const errorDetails = ref<string>('')
const isDevelopment = process.env.NODE_ENV === 'development'

// Error handling
const handleError = (error: Error) => {
	console.error('ErrorBoundary caught error:', error)

	hasError.value = true
	errorDetails.value = `${error.name}: ${error.message}\n\nStack:\n${error.stack}`

	emit('error', error)
}

// Retry functionality
const retry = async () => {
	hasError.value = false
	errorDetails.value = ''

	try {
		if (props.onRetry) {
			await props.onRetry()
		}
		emit('retry')
	} catch (error) {
		if (error instanceof Error) {
			handleError(error)
		}
	}
}

// Report error functionality
const reportError = async () => {
	if (props.onReport && errorDetails.value) {
		try {
			const error = new Error(errorDetails.value)
			await props.onReport(error)
		} catch (reportingError) {
			console.error('Failed to report error:', reportingError)
		}
	}
}

// Vue error handler
onErrorCaptured((error: Error) => {
	handleError(error)
	return false // Prevent error from propagating
})

// Reset error state when component is unmounted and remounted
onMounted(() => {
	hasError.value = false
	errorDetails.value = ''
})
</script>
