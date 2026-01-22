<template>
	<div class="flex items-center justify-center" :class="containerClass">
		<!-- Spinner -->
		<UIcon :name="spinnerIcon" class="animate-spin" :class="spinnerClass" />

		<!-- Loading Text -->
		<span v-if="showText" class="ml-3" :class="textClass">
			{{ text || $t('common.loading') }}
		</span>
	</div>
</template>

<script setup lang="ts">
interface Props {
	size?: 'sm' | 'md' | 'lg' | 'xl'
	text?: string
	showText?: boolean
	spinnerIcon?: string
	fullHeight?: boolean
	inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	size: 'md',
	showText: true,
	spinnerIcon: 'i-lucide-loader-2',
	fullHeight: false,
	inline: false
})

// Computed classes based on props
const containerClass = computed(() => {
	const classes = []

	if (props.fullHeight) {
		classes.push('min-h-[200px]')
	}

	if (props.inline) {
		classes.push('inline-flex')
	} else {
		classes.push('flex')
	}

	// Add padding based on size
	switch (props.size) {
		case 'sm':
			classes.push('py-4')
			break
		case 'md':
			classes.push('py-8')
			break
		case 'lg':
			classes.push('py-12')
			break
		case 'xl':
			classes.push('py-16')
			break
	}

	return classes.join(' ')
})

const spinnerClass = computed(() => {
	const classes = ['text-primary-500']

	switch (props.size) {
		case 'sm':
			classes.push('w-4 h-4')
			break
		case 'md':
			classes.push('w-6 h-6')
			break
		case 'lg':
			classes.push('w-8 h-8')
			break
		case 'xl':
			classes.push('w-12 h-12')
			break
	}

	return classes.join(' ')
})

const textClass = computed(() => {
	const classes = ['text-gray-600 dark:text-gray-400']

	switch (props.size) {
		case 'sm':
			classes.push('text-sm')
			break
		case 'md':
			classes.push('text-base')
			break
		case 'lg':
			classes.push('text-lg')
			break
		case 'xl':
			classes.push('text-xl')
			break
	}

	return classes.join(' ')
})
</script>
