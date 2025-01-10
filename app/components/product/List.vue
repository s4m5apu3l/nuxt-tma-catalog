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
		<transition name="fade" mode="out-in">
			<template v-if="props.status === 'pending'">
				<div class="grid grid-cols-2 gap-x-2 gap-y-4">
					<div v-for="i in 4" :key="i">
						<USkeleton class="aspect-[3/2] rounded-md" />
						<div class="py-2">
							<USkeleton class="h-[24px] w-[140px]" />
						</div>
					</div>
				</div>
			</template>

			<template v-else-if="props.status === 'error'">error</template>

			<template v-else>
				<section class="grid grid-cols-2 gap-x-2 gap-y-4">
					<slot />
				</section>
			</template>
		</transition>
	</div>
</template>
