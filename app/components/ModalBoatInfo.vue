<script setup lang="ts">
import type { BoatPoint } from '~/types/boat';
const props = defineProps<{
	boat: BoatPoint;
}>();

const emit = defineEmits<{ close: [boolean] }>();
</script>

<template>
	<UModal :close="{ onClick: () => emit('close', false) }" :title="props.boat.name">
		<template #body>
			<div class="">
				<p class="text-gray-600 dark:text-gray-300 mb-4">{{ props.boat.descr }}</p>
				<div class="border-t border-zinc-200 dark:border-zinc-600 pt-4">
					<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Маршрут</h3>
					<p class="text-gray-600 dark:text-gray-300">
						<span class="font-medium">От:</span>
						{{ props.boat.route.pointA }}
					</p>
					<p class="text-gray-600 dark:text-gray-300">
						<span class="font-medium">До:</span>
						{{ props.boat.route.pointB }}
					</p>
					<p class="text-gray-600 dark:text-gray-300">
						<span class="font-medium">Расстояние:</span>
						{{ props.boat.route.distance }} км
					</p>
					<p class="text-gray-600 dark:text-gray-300">
						<span class="font-medium">Время в пути:</span>
						{{ props.boat.route.duration }}
					</p>
					<p class="text-gray-600 dark:text-gray-300">
						<span class="font-medium">Цена:</span>
						{{ props.boat.route.price.toLocaleString() }} ₽
					</p>
				</div>
			</div>
		</template>
		<!-- <template #footer>
			<UButton color="neutral" label="Закрыть" @click="emit('close', false)" />
		</template> -->
	</UModal>
</template>

<style scoped></style>
