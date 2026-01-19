<template>
  <div class="space-y-4">
    <!-- Main Image Display -->
    <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
      <img
        v-if="currentImage"
        :src="currentImage"
        :alt="alt"
        class="w-full h-full object-cover"
        @error="onImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <UIcon name="i-lucide-image" class="w-24 h-24 text-gray-400" />
        <span class="ml-2 text-gray-500 dark:text-gray-400">{{ $t('product.noImage') }}</span>
      </div>
    </div>

    <!-- Thumbnail Navigation -->
    <div v-if="imageUrls.length > 1" class="flex space-x-2 overflow-x-auto pb-2">
      <button
        v-for="(imageUrl, index) in imageUrls"
        :key="index"
        class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors"
        :class="[
          currentImageIndex === index 
            ? 'border-primary-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        ]"
        @click="setCurrentImage(index)"
      >
        <img
          :src="imageUrl"
          :alt="`${alt} ${index + 1}`"
          class="w-full h-full object-cover"
          @error="onThumbnailError(index)"
        />
      </button>
    </div>

    <!-- Navigation Arrows for Mobile -->
    <div v-if="imageUrls.length > 1" class="flex justify-between items-center md:hidden">
      <UButton
        icon="i-lucide-chevron-left"
        variant="outline"
        size="sm"
        :disabled="currentImageIndex === 0"
        @click="previousImage"
      >
        {{ $t('product.gallery.previous') }}
      </UButton>
      
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ currentImageIndex + 1 }} / {{ imageUrls.length }}
      </span>
      
      <UButton
        icon="i-lucide-chevron-right"
        variant="outline"
        size="sm"
        :disabled="currentImageIndex === imageUrls.length - 1"
        @click="nextImage"
      >
        {{ $t('product.gallery.next') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  images: string[]
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Product image'
})

const { getImageUrl } = useProducts()

// Convert image IDs to URLs
const imageUrls = computed(() => {
  return props.images
    .map(imageId => getImageUrl(imageId))
    .filter(url => url) // Filter out empty URLs
})

// Current image state
const currentImageIndex = ref(0)
const currentImage = computed(() => {
  return imageUrls.value[currentImageIndex.value] || null
})

// Navigation methods
const setCurrentImage = (index: number) => {
  if (index >= 0 && index < imageUrls.value.length) {
    currentImageIndex.value = index
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < imageUrls.value.length - 1) {
    currentImageIndex.value++
  }
}

// Error handling
const onImageError = () => {
  console.warn('Failed to load main product image')
}

const onThumbnailError = (index: number) => {
  console.warn(`Failed to load thumbnail image at index ${index}`)
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    previousImage()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  }
}

// Reset current image when images prop changes
watch(() => props.images, () => {
  currentImageIndex.value = 0
}, { immediate: true })

// Add keyboard event listeners
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>