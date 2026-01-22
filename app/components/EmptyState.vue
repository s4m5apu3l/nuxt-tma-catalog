<template>
	<div class="text-center" :class="containerClass">
		<!-- Icon -->
		<UIcon :name="icon" class="mx-auto mb-4 text-gray-400" :class="iconClass" />

		<!-- Title -->
		<h3 class="font-semibold text-gray-900 dark:text-white mb-2" :class="titleClass">
			{{ title }}
		</h3>

		<!-- Description -->
		<p v-if="description" class="text-gray-600 dark:text-gray-400 mb-6" :class="descriptionClass">
			{{ description }}
		</p>

		<!-- Action Buttons -->
		<div
			v-if="$slots.actions || primaryAction || secondaryAction"
			class="flex flex-col sm:flex-row gap-3 justify-center"
		>
			<!-- Slot for custom actions -->
			<slot name="actions" />

			<!-- Primary Action Button -->
			<UButton
				v-if="primaryAction"
				:color="primaryAction.color || 'primary'"
				:variant="primaryAction.variant || 'solid'"
				:icon="primaryAction.icon"
				:loading="primaryAction.loading"
				:disabled="primaryAction.disabled"
				@click="primaryAction.onClick"
			>
				{{ primaryAction.label }}
			</UButton>

			<!-- Secondary Action Button -->
			<UButton
				v-if="secondaryAction"
				:color="secondaryAction.color || 'gray'"
				:variant="secondaryAction.variant || 'outline'"
				:icon="secondaryAction.icon"
				:loading="secondaryAction.loading"
				:disabled="secondaryAction.disabled"
				@click="secondaryAction.onClick"
			>
				{{ secondaryAction.label }}
			</UButton>
		</div>
	</div>
</template>

<script setup lang="ts">
interface ActionButton {
	label: string
	onClick: () => void | Promise<void>
	icon?: string
	color?: string
	variant?: string
	loading?: boolean
	disabled?: boolean
}

interface Props {
	icon: string
	title: string
	description?: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	primaryAction?: ActionButton
	secondaryAction?: ActionButton
}

const props = withDefaults(defineProps<Props>(), {
	size: 'md'
})

// Computed classes based on size
const containerClass = computed(() => {
	switch (props.size) {
		case 'sm':
			return 'py-8'
		case 'md':
			return 'py-12'
		case 'lg':
			return 'py-16'
		case 'xl':
			return 'py-20'
		default:
			return 'py-12'
	}
})

const iconClass = computed(() => {
	switch (props.size) {
		case 'sm':
			return 'w-12 h-12'
		case 'md':
			return 'w-16 h-16'
		case 'lg':
			return 'w-20 h-20'
		case 'xl':
			return 'w-24 h-24'
		default:
			return 'w-16 h-16'
	}
})

const titleClass = computed(() => {
	switch (props.size) {
		case 'sm':
			return 'text-base'
		case 'md':
			return 'text-lg'
		case 'lg':
			return 'text-xl'
		case 'xl':
			return 'text-2xl'
		default:
			return 'text-lg'
	}
})

const descriptionClass = computed(() => {
	switch (props.size) {
		case 'sm':
			return 'text-sm max-w-sm'
		case 'md':
			return 'text-base max-w-md'
		case 'lg':
			return 'text-lg max-w-lg'
		case 'xl':
			return 'text-xl max-w-xl'
		default:
			return 'text-base max-w-md'
	}
})
</script>
