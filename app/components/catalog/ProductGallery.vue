<script setup lang="ts">
interface Props {
	images: string[]
	productName: string
}

const props = defineProps<Props>()

const selectedImageIndex = ref(0)
const isLightboxOpen = ref(false)

const openLightbox = (index: number) => {
	selectedImageIndex.value = index
	isLightboxOpen.value = true
}

const closeLightbox = () => {
	isLightboxOpen.value = false
}

const nextImage = () => {
	selectedImageIndex.value = (selectedImageIndex.value + 1) % props.images.length
}

const prevImage = () => {
	selectedImageIndex.value = selectedImageIndex.value === 0 ? props.images.length - 1 : selectedImageIndex.value - 1
}

const handleKeydown = (event: KeyboardEvent) => {
	if (!isLightboxOpen.value) return

	switch (event.key) {
		case 'Escape':
			closeLightbox()
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
	<div class="product-gallery">
		<div v-if="images.length > 0" class="space-y-4">
			<div class="relative">
				<UCarousel
					v-slot="{ item, index }"
					:items="images"
					:ui="{
						item: 'basis-full',
						container: 'rounded-lg overflow-hidden'
					}"
					class="rounded-lg overflow-hidden"
					arrows
					indicators
				>
					<img
						:src="item"
						:alt="`${productName} - Image ${index + 1}`"
						class="w-full aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity"
						@click="openLightbox(index)"
					/>
				</UCarousel>
			</div>

			<div v-if="images.length > 1" class="flex space-x-2 overflow-x-auto pb-2">
				<button
					v-for="(image, index) in images"
					:key="index"
					class="shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors"
					:class="[
						selectedImageIndex === index
							? 'border-primary'
							: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
					]"
					@click="selectedImageIndex = index"
				>
					<img
						:src="image"
						:alt="`${productName} - Thumbnail ${index + 1}`"
						class="w-full h-full object-cover"
					/>
				</button>
			</div>
		</div>

		<div v-else class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
			<div class="text-center text-gray-400">
				<UIcon name="i-lucide-image" class="text-6xl mb-2" />
				<p class="text-sm">{{ $t('product.noImage') }}</p>
			</div>
		</div>

		<UModal v-model="isLightboxOpen" :ui="{ width: 'max-w-4xl' }">
			<div class="relative bg-black">
				<button
					class="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
					@click="closeLightbox"
				>
					<UIcon name="i-lucide-x" class="text-2xl" />
				</button>

				<button
					v-if="images.length > 1"
					class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
					@click="prevImage"
				>
					<UIcon name="i-lucide-chevron-left" class="text-3xl" />
				</button>

				<button
					v-if="images.length > 1"
					class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
					@click="nextImage"
				>
					<UIcon name="i-lucide-chevron-right" class="text-3xl" />
				</button>

				<img
					:src="images[selectedImageIndex]"
					:alt="`${productName} - Image ${selectedImageIndex + 1}`"
					class="w-full max-h-[80vh] object-contain"
				/>

				<div
					v-if="images.length > 1"
					class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm"
				>
					{{ selectedImageIndex + 1 }} / {{ images.length }}
				</div>
			</div>
		</UModal>
	</div>
</template>

<style scoped>
.product-gallery {
	@apply w-full;
}
</style>
