<script setup lang="ts">
const cartItems = useCart();
</script>

<template>
	<transition
		name="slide-fade"
		enter-active-class="transition-all duration-500 ease-out"
		leave-active-class="transition-all duration-300 ease-in"
		enter-from-class="transform translate-y-full"
		enter-to-class="transform translate-y-0"
		leave-from-class="transform translate-y-0"
		leave-to-class="transform translate-y-full"
	>
		<div
			v-if="cartItems.length"
			class="fixed z-10 bottom-0 w-full py-3 border-t border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
		>
			<div class="l-wrapper">
				<UButton icon="i-material-symbols:shopping-bag-outline" block>Корзина ({{ cartItems.length }})</UButton>
			</div>
		</div>
	</transition>
</template>
