<script lang="ts">
interface IProps {
	status: 'idle' | 'pending' | 'success' | 'error';
}
</script>

<script setup lang="ts">
const props = defineProps<IProps>();
</script>

<template>
	<div class="l-product-list">
		<template v-if="props.status === 'pending'">loading</template>
		<template v-else-if="props.status === 'error'">error</template>
		<template v-else>
			<section class="grid grid-cols-2 gap-4">
				<slot />
			</section>
		</template>
	</div>
</template>
