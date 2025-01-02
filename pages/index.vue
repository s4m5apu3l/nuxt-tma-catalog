<script setup lang="ts">
// import { LazyModalContent } from '#components';
const colorMode = useColorMode();

const isDark = computed({
	get() {
		return colorMode.value === 'dark';
	},
	set() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
	},
});

const modal = useModal();
const resolveModalContent = defineAsyncComponent(() => import('~/components/ModalContent.vue'));

const openModal = () => {
	modal.open(resolveModalContent, { title: 'Welcome', description: 'And you can even provide a description!' });
};

const closeModal = async () => {
	await modal.close();
};

const updateModalTitle = () => {
	modal.patch({ title: 'Updated Welcome' });
};
</script>

<template>
	<div>
		<UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost" @click="isDark = !isDark" />

		<UButton @click="openModal" class="test">Open Modal</UButton>
		<UButton @click="closeModal">Close Modal</UButton>
		<UButton @click="updateModalTitle">Update Title</UButton>
	</div>
</template>

<style scoped>
.test {
	color: red;
}
</style>
