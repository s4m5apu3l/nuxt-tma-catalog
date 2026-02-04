<script setup lang="ts">
import { popularCategoryIcons, iconCategories, getIconName, getIconsByCategory, findIcon } from '~/utils/icons'

interface Props {
	modelValue?: string
	placeholder?: string
}

interface Emits {
	'update:modelValue': [value: string]
}

const props = withDefaults(defineProps<Props>(), {
	placeholder: 'Выберите иконку'
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const searchTerm = ref('')
const selectedCategory = ref('all')

const currentIcon = computed({
	get: () => props.modelValue || '',
	set: (value: string) => emit('update:modelValue', value)
})

const filteredIcons = computed(() => {
	let icons = popularCategoryIcons

	// Фильтр по категории
	if (selectedCategory.value !== 'all') {
		icons = getIconsByCategory(selectedCategory.value)
	}

	// Поиск
	if (searchTerm.value.trim()) {
		icons = findIcon(searchTerm.value)
	}

	return icons
})

const selectIcon = (iconName: string) => {
	currentIcon.value = iconName
	isOpen.value = false
	searchTerm.value = ''
	selectedCategory.value = 'all'
}

const currentIconDisplay = computed(() => {
	if (!currentIcon.value) return null
	
	const cleanName = currentIcon.value.replace('i-lucide-', '')
	const iconData = popularCategoryIcons.find(icon => icon.name === cleanName)
	
	return {
		name: getIconName(currentIcon.value),
		label: iconData?.label || cleanName
	}
})
</script>

<template>
	<div class="relative">
		<UButton
			variant="outline"
			color="neutral"
			class="w-full justify-between"
			@click="isOpen = !isOpen"
		>
			<div class="flex items-center gap-2">
				<UIcon
					v-if="currentIconDisplay"
					:name="currentIconDisplay.name"
					class="w-4 h-4"
				/>
				<span>
					{{ currentIconDisplay?.label || placeholder }}
				</span>
			</div>
			<UIcon
				name="i-lucide-chevron-down"
				class="w-4 h-4 transition-transform"
				:class="{ 'rotate-180': isOpen }"
			/>
		</UButton>

		<div
			v-if="isOpen"
			class="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-hidden"
		>
			<div class="p-3 border-b border-gray-200 dark:border-gray-700">
				<UInput
					v-model="searchTerm"
					placeholder="Поиск иконок..."
					class="mb-2"
				>
					<template #leading>
						<UIcon name="i-lucide-search" class="w-4 h-4" />
					</template>
				</UInput>

				<div class="flex gap-1 flex-wrap">
					<UButton
						size="xs"
						:variant="selectedCategory === 'all' ? 'solid' : 'outline'"
						@click="selectedCategory = 'all'"
					>
						Все
					</UButton>
					<UButton
						v-for="category in iconCategories"
						:key="category.key"
						size="xs"
						:variant="selectedCategory === category.key ? 'solid' : 'outline'"
						@click="selectedCategory = category.key"
					>
						{{ category.label }}
					</UButton>
				</div>
			</div>

			<div class="max-h-48 overflow-y-auto p-2">
				<div class="grid grid-cols-6 gap-1">
					<button
						v-for="icon in filteredIcons"
						:key="icon.name"
						class="flex flex-col items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						:class="{
							'bg-primary-100 dark:bg-primary-900': currentIcon === icon.name
						}"
						@click="selectIcon(icon.name)"
					>
						<UIcon
							:name="getIconName(icon.name)"
							class="w-5 h-5 mb-1"
						/>
						<span class="text-xs text-center leading-tight">
							{{ icon.label }}
						</span>
					</button>
				</div>

				<div
					v-if="filteredIcons.length === 0"
					class="text-center py-4 text-gray-500"
				>
					Иконки не найдены
				</div>
			</div>
		</div>

		<div
			v-if="isOpen"
			class="fixed inset-0 z-40"
			@click="isOpen = false"
		/>
	</div>
</template>