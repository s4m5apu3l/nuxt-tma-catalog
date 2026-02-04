<script setup lang="ts">
import { getImageUrl } from '~/utils/images'

interface Props {
	images: string[]
	alt: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const currentIndex = ref(0)
const isModalOpen = ref(false)

const currentImage = computed(() => {
	return props.images[currentIndex.value] || null
})

const currentImageUrl = computed(() => {
	if (!currentImage.value) return null
	return getImageUrl(currentImage.value)
})

const thumbnailUrl = (imageId: string): string => {
	return getImageUrl(imageId)
}

const nextImage = (): void => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

const previousImage = (): void => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.images.length - 1
  }
}

const selectImage = (index: number): void => {
  currentIndex.value = index
}

const openModal = (): void => {
  isModalOpen.value = true
}

const closeModal = (): void => {
  isModalOpen.value = false
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent): void => {
  if (!isModalOpen.value) return
  
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      previousImage()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextImage()
      break
    case 'Escape':
      event.preventDefault()
      closeModal()
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
  <div v-if="images.length > 0" class="space-y-4">
    <!-- Main Image -->
    <div class="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      <img
        v-if="currentImageUrl"
        :src="currentImageUrl"
        :alt="alt"
        class="w-full h-full object-cover cursor-pointer"
        @click="openModal"
      />
      
      <!-- Navigation Arrows -->
      <div v-if="images.length > 1" class="absolute inset-0 flex items-center justify-between p-4">
        <UButton
          icon="i-lucide-chevron-left"
          color="neutral"
          variant="solid"
          size="sm"
          class="opacity-70 hover:opacity-100 transition-opacity"
          @click="previousImage"
        />
        <UButton
          icon="i-lucide-chevron-right"
          color="neutral"
          variant="solid"
          size="sm"
          class="opacity-70 hover:opacity-100 transition-opacity"
          @click="nextImage"
        />
      </div>
      
      <!-- Image Counter -->
      <div v-if="images.length > 1" class="absolute bottom-4 right-4">
        <UBadge color="neutral" variant="solid" class="opacity-80">
          {{ currentIndex + 1 }} / {{ images.length }}
        </UBadge>
      </div>
    </div>

    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="(imageId, index) in images"
        :key="imageId"
        class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors"
        :class="{
          'border-primary-500': index === currentIndex,
          'border-gray-200 dark:border-gray-700': index !== currentIndex
        }"
        @click="selectImage(index)"
      >
        <img
          :src="thumbnailUrl(imageId)"
          :alt="`${alt} ${index + 1}`"
          class="w-full h-full object-cover"
        />
      </button>
    </div>

    <!-- Modal -->
    <UModal v-model="isModalOpen">
      <div class="p-4 max-w-4xl mx-auto">
        <div class="relative">
          <img
            v-if="currentImage && currentImageUrl"
            :src="currentImageUrl"
            :alt="alt"
            class="w-full h-auto max-h-[80vh] object-contain"
          />
          
          <!-- Modal Navigation -->
          <div v-if="images.length > 1" class="absolute inset-0 flex items-center justify-between p-4">
            <UButton
              icon="i-lucide-chevron-left"
              color="neutral"
              variant="solid"
              @click="previousImage"
            />
            <UButton
              icon="i-lucide-chevron-right"
              color="neutral"
              variant="solid"
              @click="nextImage"
            />
          </div>
          
          <!-- Close Button -->
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="solid"
            size="sm"
            class="absolute top-4 right-4"
            @click="closeModal"
          />
        </div>
        
        <!-- Modal Thumbnails -->
        <div v-if="images.length > 1" class="flex gap-2 mt-4 overflow-x-auto">
          <button
            v-for="(imageId, index) in images"
            :key="imageId"
            class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors"
            :class="{
              'border-primary-500': index === currentIndex,
              'border-gray-200 dark:border-gray-700': index !== currentIndex
            }"
            @click="selectImage(index)"
          >
            <img
              :src="thumbnailUrl(imageId)"
              :alt="`${alt} ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </UModal>
  </div>

  <!-- No Images Placeholder -->
  <div v-else class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
    <div class="text-center text-gray-400">
      <UIcon name="i-lucide-image" class="text-6xl mb-2" />
      <p class="text-sm">{{ t('product.noImage') }}</p>
    </div>
  </div>
</template>