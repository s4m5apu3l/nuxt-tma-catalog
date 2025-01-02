<script setup lang="ts">
import { ModalContent } from '#components';
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
// const resolveModalContent = defineAsyncComponent(() => import('@/components/ModalContent.vue'));
// const resolveModalContent = resolveComponent('ModalContent.vue');

const openModal = () => {
	modal.open(ModalContent, { title: 'Welcome dsdasd', description: 'And you can even provide a description!' });
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

		<UButton class="bg-amber-200" @click="openModal">Open Modal</UButton>
		<UButton @click="closeModal">Close Modal</UButton>
		<UButton @click="updateModalTitle">Update Title</UButton>
		<section class="l-wrapper">
			<div class="flex items-center gap-4">
				<USkeleton class="h-12 w-12 rounded-full" />

				<div class="grid gap-2">
					<USkeleton class="h-4 w-[250px]" />
					<USkeleton class="h-4 w-[200px]" />
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
.test {
	color: red;
}
</style>
