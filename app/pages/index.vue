<script setup lang="ts">
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
const resolveModalContent = defineAsyncComponent(() => import('@/components/ModalContent.vue'));

const openModal = () => {
	modal.open(resolveModalContent, { title: 'Welcome dsdasd', description: 'And you can even provide a description!' });
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
		<section class="container mx-auto">
			<div class="mt-4">
				<UCard>
					<template #header>
						<Placeholder class="h-8" />
					</template>

					<Placeholder class="h-32" />

					<template #footer>
						<Placeholder class="h-8" />
					</template>
				</UCard>
			</div>
		</section>
	</div>
</template>

<style scoped>
.test {
	color: red;
}
</style>
