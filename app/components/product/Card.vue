<script lang="ts">
import type { IProduct } from '@/types/product';
interface IProps {
	data: IProduct;
}
</script>

<script setup lang="ts">
const props = defineProps<IProps>();
</script>

<template>
	<article class="">
		<pre>{{ props }}</pre>
	</article>
</template>
