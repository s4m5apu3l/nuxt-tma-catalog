<script setup lang="ts">
import type { BoatPoint } from '~/types/boat';
import { LazyModalBoatInfo } from '#components';

let map: any;
const markers = new Map<string, any>(); // Хранит маркеры mapgl.Marker
const previousPositions = new Map<string, [number, number]>(); // Хранит предыдущие координаты
const previousAngles = new Map<string, number>(); // Хранит предыдущие углы
const isActive = ref(true); // flag activnosti componenta

function calculateBearing(from: [number, number], to: [number, number]): number {
	const [lon1, lat1] = from;
	const [lon2, lat2] = to;

	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const lat1Rad = (lat1 * Math.PI) / 180;
	const lat2Rad = (lat2 * Math.PI) / 180;

	const y = Math.sin(dLon) * Math.cos(lat2Rad);
	const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
	let bearing = Math.atan2(y, x);

	bearing = (bearing * 180) / Math.PI;
	bearing = (bearing + 360) % 360;

	return bearing;
}

const overlay = useOverlay();

const modal = overlay.create(LazyModalBoatInfo);

async function updateBoats() {
	try {
		const res = await $fetch<BoatPoint[]>('/api/get-boats');

		if (res) {
			res.forEach((boat) => {
				const current: [number, number] = [boat.longitude, boat.latitude];
				const previous = previousPositions.get(boat.id);
				let angle: number;

				const threshold = 0.00003;

				// Рассчитываем угол, если есть предыдущие координаты и лодка движется
				if (previous && (Math.abs(previous[0] - current[0]) > threshold || Math.abs(previous[1] - current[1]) > threshold)) {
					angle = calculateBearing(previous, current);
					previousAngles.set(boat.id, angle);
				} else {
					// Если нет движения или это первое обновление, используем предыдущий угол или 0
					angle = previousAngles.get(boat.id) ?? 0;
				}

				// Сохраняем текущие координаты как предыдущие
				previousPositions.set(boat.id, [...current]);

				let marker = markers.get(boat.id);
				if (marker) {
					marker.setCoordinates(current);
					marker.setRotation(angle);
				} else {
					//@ts-ignore
					marker = new mapgl.Marker(map, {
						coordinates: current,
						icon: '/img/ferry.png',
						size: [34, 34],
						label: {
							text: boat.name,
						},
						rotation: angle,
						rotationType: 'rotate',
					});
					markers.set(boat.id, marker);

					marker.on('click', () => {
						modal.open({
							boat: boat,
						});
					});
				}
			});

			const currentIds = new Set(res.map((boat) => boat.id));
			for (const [id, marker] of markers) {
				if (!currentIds.has(id)) {
					marker.destroy();
					markers.delete(id);
					previousPositions.delete(id);
					previousAngles.delete(id);
				}
			}
		}
	} catch (e) {
		console.error('Ошибка в updateBoats', e);
	}

	// Планируем следующий вызов, только если компонент активен
	if (isActive.value) {
		setTimeout(updateBoats, 6000);
	}
}

onMounted(() => {
	// @ts-ignore - mapgl is not typed
	map = new mapgl.Map('map-container', {
		key: useRuntimeConfig().public.keyMap,
		center: [129.82011, 62.00419],
		zoom: 12,
		zoomControl: 'centerRight',
	});

	isActive.value = true;
	updateBoats();
});

onUnmounted(() => {
	isActive.value = false;
	markers.forEach((marker) => marker.destroy());
	markers.clear();
	previousPositions.clear();
	previousAngles.clear();
});
</script>

<template>
	<div class="h-full">
		<div id="map-container" />
	</div>
</template>

<style scoped>
#map-container {
	width: 100%;
	height: calc(100dvh - 48px);
}
</style>
