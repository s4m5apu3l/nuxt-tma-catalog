<script setup lang="ts">
const modal = useModal();
</script>

<template>
	<UModal>
		<template #footer>
			<UButton color="neutral" label="Close" @click="modal.close()" />
		</template>
	</UModal>
</template>

<style lang="css" scoped></style>
