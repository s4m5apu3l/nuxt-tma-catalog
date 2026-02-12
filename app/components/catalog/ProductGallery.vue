<script setup lang="ts">
interface Props {
	images: readonly string[]
	alt: string
}

const props = defineProps<Props>()

const currentIndex = ref(0)
const isModalOpen = ref(false)

const imageUrls = computed(() => props.images.map((imageId) => getImageUrl(imageId)))

const currentImageUrl = computed(() => imageUrls.value[currentIndex.value] || null)

const openModal = (index: number) => {
	currentIndex.value = index
	isModalOpen.value = true
}

const closeModal = () => {
	isModalOpen.value = false
}

const nextImage = () => {
	currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevImage = () => {
	currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1
}

const selectImage = (index: number) => {
	currentIndex.value = index
}

const handleKeydown = (event: KeyboardEvent) => {
	if (!isModalOpen.value) return

	switch (event.key) {
		case 'Escape':
			closeModal()
			break
		case 'ArrowLeft':
			prevImage()
			break
		case 'ArrowRight':
			nextImage()
			break
	}
}

onMounted(() => {
	document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
	<div class="space-y-4">
		<div
			v-if="imageUrls.length > 0"
			class="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden group"
		>
			<img
				:src="currentImageUrl"
				:alt="`${alt} - ${currentIndex + 1}`"
				class="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
				@click="openModal(currentIndex)"
			/>

			<div
				v-if="imageUrls.length > 1"
				class="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity"
			>
				<UButton
					icon="i-lucide-chevron-left"
					color="white"
					variant="solid"
					size="lg"
					class="shadow-lg"
					@click.stop="prevImage"
				/>
				<UButton
					icon="i-lucide-chevron-right"
					color="white"
					variant="solid"
					size="lg"
					class="shadow-lg"
					@click.stop="nextImage"
				/>
			</div>

			<div class="absolute top-4 right-4">
				<UButton
					icon="i-lucide-expand"
					color="white"
					variant="solid"
					size="sm"
					class="shadow-lg"
					@click="openModal(currentIndex)"
				/>
			</div>

			<div v-if="imageUrls.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2">
				<UBadge color="black" variant="solid" size="lg" class="shadow-lg">
					{{ currentIndex + 1 }} / {{ imageUrls.length }}
				</UBadge>
			</div>
		</div>

		<div v-else class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
			<div class="text-center text-gray-400">
				<UIcon name="i-lucide-image" class="w-16 h-16 mb-2 mx-auto" />
				<p class="text-sm">{{ $t('product.noImage') }}</p>
			</div>
		</div>

		<div v-if="imageUrls.length > 1" class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
			<button
				v-for="(url, index) in imageUrls"
				:key="index"
				class="shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105"
				:class="{
					'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800': index === currentIndex,
					'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600':
						index !== currentIndex
				}"
				@click="selectImage(index)"
			>
				<img :src="url" :alt="`${alt} thumbnail ${index + 1}`" class="w-full h-full object-cover" />
			</button>
		</div>

		<UModal v-model="isModalOpen" :ui="{ width: 'max-w-7xl' }">
			<UCard
				:ui="{
					body: { padding: 'p-0' },
					header: { padding: 'px-4 py-3' }
				}"
			>
				<template #header>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<UBadge color="gray" variant="soft">
								{{ currentIndex + 1 }} / {{ imageUrls.length }}
							</UBadge>
							<span class="text-sm text-gray-600 dark:text-gray-400">{{ alt }}</span>
						</div>
						<UButton icon="i-lucide-x" color="gray" variant="ghost" size="sm" @click="closeModal" />
					</div>
				</template>

				<div class="relative bg-black">
					<div class="flex items-center justify-center min-h-[70vh] max-h-[85vh] p-4">
						<img
							:src="imageUrls[currentIndex]"
							:alt="`${alt} - ${currentIndex + 1}`"
							class="max-w-full max-h-full object-contain"
						/>
					</div>

					<div
						v-if="imageUrls.length > 1"
						class="absolute inset-0 flex items-center justify-between p-6 pointer-events-none"
					>
						<UButton
							icon="i-lucide-chevron-left"
							color="white"
							variant="solid"
							size="xl"
							class="pointer-events-auto shadow-2xl"
							@click="prevImage"
						/>
						<UButton
							icon="i-lucide-chevron-right"
							color="white"
							variant="solid"
							size="xl"
							class="pointer-events-auto shadow-2xl"
							@click="nextImage"
						/>
					</div>
				</div>

				<div v-if="imageUrls.length > 1" class="p-4 bg-gray-50 dark:bg-gray-900">
					<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
						<button
							v-for="(url, index) in imageUrls"
							:key="index"
							class="shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105"
							:class="{
								'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800': index === currentIndex,
								'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600':
									index !== currentIndex
							}"
							@click="selectImage(index)"
						>
							<img :src="url" :alt="`${alt} thumbnail ${index + 1}`" class="w-full h-full object-cover" />
						</button>
					</div>
				</div>
			</UCard>
		</UModal>
	</div>
</template>

<style scoped>
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
</style>
