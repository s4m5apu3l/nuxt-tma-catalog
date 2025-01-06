<script setup lang="ts">
const isContainProducts = ref(false);

onMounted(() => {
	setTimeout(() => {
		isContainProducts.value = true;
	}, 2000);
});
</script>

<template>
	<transition
		name="slide-fade"
		enter-active-class="transition-all duration-500 ease-out"
		leave-active-class="transition-all duration-300 ease-in"
		enter-class="transform translate-y-full"
		leave-to-class="transform translate-y-full"
	>
		<div
			v-show="isContainProducts"
			class="fixed bottom-0 w-full py-3 border-t border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
		>
			<div class="l-wrapper">
				<UButton block>Корзина (0)</UButton>
			</div>
		</div>
	</transition>
</template>
