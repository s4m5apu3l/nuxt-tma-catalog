<script setup lang="ts">
// import { MainButton, useWebAppPopup } from 'vue-tg';
import type { IProduct } from '@/types/product';
// const { showAlert } = useWebAppPopup();

definePageMeta({
	validate: async (route) => {
		return typeof route.params.slug === 'string' && isNaN(parseInt(route.params.slug, 10));
	},
});

const sizes = useScreenSize();
const route = useRoute();
// $fetch(`/api/products?category=${route.params.slug}`)
const { data: products, status } = useAsyncData(`${route.params.slug}`, async () => {
	return await $fetch(`/api/products`);
});

const modal = useModal();
const resolveModalContent = defineAsyncComponent(() => import('~/components/product/DrawerContent.vue'));

const drawerContent = useState<{ isOpen: boolean; product: IProduct | null }>('drawer-content');
// const selectedProduct = ref<IProduct | null>(null);

const openCardDetail = (product: IProduct) => {
	console.dir(sizes);
	if (sizes.isMobile) {
		drawerContent.value.product = product;
		drawerContent.value.isOpen = true;
	} else {
		// selectedProduct.value = product;
		modal.open(resolveModalContent, {
			data: product,
		});
	}
};
</script>

<template>
	<product-list :status="status">
		<pre>{{ sizes.screenSize }}</pre>
		<product-card v-for="product in products" :key="product.id" :data="product" @click="openCardDetail(product)" />
	</product-list>
</template>
