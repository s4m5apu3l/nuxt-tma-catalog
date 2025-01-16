<script lang="ts">
import type { IProduct } from '@/types/product';
interface IProps {
	data: IProduct;
	variant?: 'default' | 'secondary';
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<IProps>(), {
	variant: 'default',
});

// const cartItems = useCart();
// const addItemToCart = (item: IProduct) => {
// 	cartItems.value.push(item);
// };
// const alreadyInCart = (id: number) => {
// 	const x = cartItems.value?.find((el) => el.id === id);
// 	if (x?.id) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// };

// todo
// if card have a lot sizes  to nado sdelat tak 4toby pri clicke na dobavit v korzniy
// to otkruvaetsya modalka, esli tolko odin size to srazy v cart/
</script>

<template>
	<article class="flex flex-col h-full">
		<header class="relative overflow-hidden rounded-md">
			<nuxt-img
				class="aspect-[3/2] w-full h-full object-cover"
				:src="props.data.thumbnail"
				alt="img product"
				loading="lazy"
				quality="50"
			/>
			<UBadge v-if="props.variant === 'secondary'" class="absolute right-2 bottom-2">
				<span class="font-bold block ml-auto text-lg sm:text-2xl">
					{{ useFormatPrice(props.data.price) }}
				</span>
			</UBadge>
		</header>

		<main class="py-2">
			<div class="flex flex-col gap-2">
				<span class="font-semibold text-base line-clamp-2">{{ props.data.name }}</span>
				<span v-if="props.variant === 'default'" class="font-bold block ml-auto text-lg sm:text-2xl">
					{{ useFormatPrice(props.data.price) }}
				</span>
			</div>

			<!-- <div class="mt-2">
				<span class="text-zinc-600">
					{{ props.data.available ? 'В наличии' : 'Нет в наличии' }}
				</span>
			</div> -->
		</main>

		<!-- <footer class="mt-auto">
			<UButton block :disabled="alreadyInCart(props.data.id)" @click="addItemToCart(props.data)">
				{{ alreadyInCart(props.data.id) ? 'В корзине' : 'В корзину' }}
			</UButton>
		</footer> -->
	</article>
</template>
