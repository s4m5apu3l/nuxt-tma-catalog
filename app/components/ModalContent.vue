<script setup lang="ts">
import type { IProduct } from '@/types/product';
const modal = useModal();

const props = defineProps<{
	data: IProduct;
}>();
</script>

<template>
	<UModal :title="props.data.name">
		<template #body>
			<UCarousel
				v-slot="{ item }"
				:items="props.data.images"
				:ui="{ item: 'basis-full' }"
				class="rounded-lg overflow-hidden"
				arrows
				indicators
			>
				<nuxt-img :src="item.url" alt="img card product" class="w-full aspect-[3/2]" draggable="false" loading="lazy" />
			</UCarousel>
		</template>

		<template #footer>
			<UButton color="neutral" label="Close" @click="modal.close()" />
		</template>
	</UModal>
</template>

<style lang="css" scoped></style>
