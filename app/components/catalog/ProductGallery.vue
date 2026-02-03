<script setup lang="ts">
interface Props {
	images: string[]
	productName: string
}

const props = defineProps<Props>()

const selectedImageIndex = ref(0)
const isLightboxOpen = ref(false)

const imageUrls = computed(() => props.images.map((imageId) => getImageUrl(imageId)))

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
		<UCarousel
			v-if="imageUrls.length > 0"
			v-slot="{ item, index }"
			:items="imageUrls"
			:ui="{
				item: 'basis-full',
				container: 'rounded-lg overflow-hidden'
			}"
			arrows
			indicators
			class="w-full"
		>
			<img
				:src="item"
				:alt="`${productName} - изображение ${index + 1}`"
				class="w-full aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity"
				loading="lazy"
				@click="openLightbox(index)"
			/>
		</UCarousel>

		<div
			v-else
			class="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
		>
			<UIcon name="i-lucide-image" class="w-16 h-16 text-gray-400" />
		</div>

		<!-- Lightbox Modal -->
		<UModal v-model="isLightboxOpen">
			<div class="relative">
				<UButton
					icon="i-lucide-x"
					color="neutral"
					variant="ghost"
					size="sm"
					class="absolute top-2 right-2 z-10"
					@click="closeLightbox"
				/>

				<div class="flex items-center justify-center min-h-[60vh]">
					<img
						:src="imageUrls[selectedImageIndex]"
						:alt="`${productName} - изображение ${selectedImageIndex + 1}`"
						class="max-w-full max-h-[80vh] object-contain"
					/>
				</div>

				<div v-if="imageUrls.length > 1" class="flex justify-between items-center p-4">
					<UButton icon="i-lucide-chevron-left" variant="ghost" size="sm" @click="prevImage" />

					<span class="text-sm text-gray-500">{{ selectedImageIndex + 1 }} / {{ imageUrls.length }}</span>

					<UButton icon="i-lucide-chevron-right" variant="ghost" size="sm" @click="nextImage" />
				</div>
			</div>
		</UModal>
	</div>
</template>
