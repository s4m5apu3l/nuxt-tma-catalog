<script setup lang="ts">
const modal = useModal();

const props = defineProps<{
	data: unknown;
}>();
</script>

<template>
	<UModal>
		<template #body>
			<section>
				<header class="px-4 py-5 sm:px-6">
					<h2 class="text-[var(--ui-text-highlighted)] font-semibold">
						{{ props.data.name }}
					</h2>
				</header>
				<main>
					<pre>{{ props.data }}</pre>
				</main>
				<footer>
					<UButton color="neutral" label="Close" @click="modal.close()" />
				</footer>
			</section>
		</template>
	</UModal>
</template>

<style lang="css" scoped></style>
