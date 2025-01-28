<script setup lang="ts">
import type { IProduct } from '@/types/product';

const drawerContent = useState<{ isOpen: boolean; product: IProduct | null }>('drawer-content', () => {
	return {
		isOpen: false,
		product: null,
	};
});
// const selectedProduct = ref<IProduct | null>(null);
</script>

<template>
	<div class="py-4">
		<client-only>
			<!-- dsa ETO DL9 TG poka otmena -->
			<mini-app />
		</client-only>

		<section class="max-w-[768px] mx-auto">
			<main-categories />
		</section>

		<section class="l-wrapper !mt-4">
			<nuxt-page />
		</section>

		<UDrawer v-model:open="drawerContent.isOpen" should-scale-background>
			<template #content>
				<article class="my-4 h-screen overflow-y-auto">
					<UCarousel
						v-slot="{ item }"
						:items="drawerContent.product?.images"
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

					<main class="py-4">
						<p>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium, perferendis nihil soluta aliquam
							distinctio deleniti ullam. Quisquam dicta nostrum tempore cupiditate totam minima quis illum ad veniam!
							Possimus, officia perspiciatis.
						</p>
					</main>
				</article>
			</template>
		</UDrawer>
	</div>
</template>
