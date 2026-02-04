<script setup lang="ts">
import type { Product } from '~/types'
import { getProductName, getLocalizedDescription } from '~/utils/localization'

interface Props {
	product: Product
}

const props = defineProps<Props>()
const { locale } = useI18n()

const productName = computed(() => getProductName(props.product, locale.value))
const productDescription = computed(() => getLocalizedDescription(props.product.description, locale.value))

const primaryImage = computed(() => {
	return props.product.images && props.product.images.length > 0 ? props.product.images[0] : null
})

const formatPrice = (price: number, unit: string) => {
	return `${price} ${unit}`
}
</script>

<template>
	<UCard class="hover:shadow-lg transition-shadow duration-200 group">
		<NuxtLink :to="`/product/${product.slug}`" class="block">
			<div class="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
				<img
					v-if="primaryImage"
					:src="getImageUrl(primaryImage)"
					:alt="productName"
					class="w-full h-full object-cover"
					loading="lazy"
				/>
				<div v-else class="w-full h-full flex items-center justify-center text-gray-400">
					<UIcon name="i-lucide-image" class="text-4xl" />
				</div>

				<div v-if="!product.isAvailable" class="absolute top-2 right-2">
					<UBadge color="error" variant="solid">
						{{ $t('product.unavailable') }}
					</UBadge>
				</div>
			</div>

			<div class="p-4 space-y-2">
				<h3
					class="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
				>
					{{ productName }}
				</h3>

				<p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
					{{ productDescription }}
				</p>

				<div class="flex items-center justify-between pt-2">
					<div class="text-lg font-bold text-primary-600 dark:text-primary-400">
						{{ formatPrice(product.price, product.priceUnit) }}
					</div>

					<UIcon
						name="i-lucide-chevron-right"
						class="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
					/>
				</div>
			</div>
		</NuxtLink>
	</UCard>
</template>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
