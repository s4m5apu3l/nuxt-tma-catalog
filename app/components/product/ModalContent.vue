<script setup lang="ts">
import type { IProduct } from '@/types/product';
const modal = useModal();

const props = defineProps<{
	data: IProduct;
}>();
</script>

<template>
	<UModal
		:title="props.data.name"
		:close="{
			color: 'neutral',
			variant: 'solid',
		}"
	>
		<template #body>
			<article>
				<header>
					<UCarousel
						v-slot="{ item }"
						:items="props.data.images"
						:ui="{ item: 'basis-full', dots: 'bottom-3' }"
						prev-icon="i-lucide-chevron-left"
						next-icon="i-lucide-chevron-right"
						class=""
						fade
						dots
					>
						<nuxt-img
							:src="item.url"
							alt="img card product"
							class="w-full object-cover rounded-md aspect-[3/2]"
							draggable="false"
							loading="lazy"
						/>
					</UCarousel>
				</header>

				<main class="py-4">
					<p>
						{{ props.data.description }}
					</p>
				</main>
			</article>
		</template>

		<template #footer>
			<UButton color="neutral" label="Close" @click="modal.close()" />
		</template>
	</UModal>
</template>

<style lang="css" scoped></style>
