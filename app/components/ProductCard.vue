<template>
  <UCard class="hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateToProduct">
    <!-- Product Image -->
    <div class="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
      <img
        v-if="productImage"
        :src="productImage"
        :alt="product.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-400" />
      </div>
    </div>

    <!-- Product Info -->
    <div class="space-y-2">
      <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-2">
        {{ product.title }}
      </h3>
      
      <p v-if="product.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {{ product.description }}
      </p>
      
      <div class="flex items-center justify-between">
        <span class="text-lg font-bold text-primary-600 dark:text-primary-400">
          {{ formatPrice(product.price) }}
        </span>
        <UIcon 
          name="i-lucide-arrow-right" 
          class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Product {
  $id: string
  categoryId: string
  title: string
  description: string
  price: number
  images: string[]
  $createdAt: string
  $updatedAt: string
}

interface Props {
  product: Product
}

const props = defineProps<Props>()
const { getImageUrl } = useProducts()

// Get first product image
const productImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    return getImageUrl(props.product.images[0])
  }
  return null
})

// Format price with currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(price)
}

// Navigate to product detail page
const navigateToProduct = () => {
  navigateTo(`/product/${props.product.$id}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>