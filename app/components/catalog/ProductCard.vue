<script setup lang="ts">
import type { Product } from '~/types'
import { getProductName, getLocalizedDescription } from '~/utils/localization'
import { getImageUrl } from '~/utils/images'
import { formatPricing } from '~/utils/pricing'

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

const primaryImageUrl = computed(() => {
	if (!primaryImage.value) return null
	return getImageUrl(primaryImage.value)
})

const priceLabel = computed(() => {
	return formatPricing(props.product.pricing, locale.value)
})
</script>

<template>
	<UCard :ui="{ body: 'p-2' }" class="hover:shadow-lg transition-shadow duration-200 group">
		<NuxtLink :to="`/product/${product.slug}`" class="block">
			<div class="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
				<img
					v-if="primaryImageUrl"
					:src="primaryImageUrl"
					:alt="productName"
					class="w-full h-full object-cover"
					loading="lazy"
				/>
				<div v-else class="w-full h-full flex items-center justify-center text-gray-400">
					<UIcon name="i-lucide-image" class="text-4xl" />
				</div>
			</div>

			<div class="content py-2">
				<div class="flex items-start justify-between gap-2 mb-1">
					<h3
						class="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1"
					>
						{{ productName }}
					</h3>
				</div>
				<UBadge v-if="!product.isAvailable" color="error" variant="soft" size="xs" class="shrink-0">
					{{ $t('product.unavailable') }}
				</UBadge>

				<p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
					{{ productDescription }}
				</p>

				<div class="flex items-center justify-between pt-2">
					<div class="text-lg font-bold text-primary-600 dark:text-primary-400">
						{{ priceLabel }}
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
