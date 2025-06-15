import { ref } from 'vue';

const ferryData = ref([
	{
		id: '1',
		name: 'Моторка 1',
		descr: 'Компактная и надежная моторка для перевозок по рекам Якутии. Идеально подходит для небольших групп и рыбалки. Вместимость: до 4 человек. Оснащена современным мотором и GPS-навигацией.',
		longitude: 129.90543,
		latitude: 61.967058,
		to: [129.771629, 62.044241],
		route: {
			pointA: 'Якутск',
			pointB: 'Намцы',
			distance: 85, // in kilometers
			duration: '1 час 30 минут', // estimated travel time
			price: 5000, // in Rubles
		},
	},
	{
		id: '2',
		name: 'Моторка 2',
		descr: 'Моторка топовая в якутске 2',
		longitude: 129.771629,
		latitude: 62.044241,
		to: [129.90543, 61.967058],
		route: {
			pointA: 'Якутск',
			pointB: 'Намцы',
			distance: 55,
			duration: '2 час 30 минут', 
			price: 1000, 
		},
	},
]);

let intervals: any = [];

export default defineEventHandler(() => {
	intervals.forEach(clearInterval);
	intervals = [];

	intervals = ferryData.value.map((ferry, index) => {
		return setInterval(() => {
			// const step = 0.00005; // 5 метров
			const step = 0.005;
			let reachedTarget = true; // Флаг для проверки достижения цели

			// Обновляем longitude
			if (Math.abs(ferry.longitude - ferry.to[0]) > step) {
				if (ferry.longitude < ferry.to[0]) {
					ferry.longitude += step; // Двигаемся вправо
				} else {
					ferry.longitude -= step; // Двигаемся влево
				}
				reachedTarget = false;
			} else {
				ferry.longitude = ferry.to[0]; // Точная подгонка
			}

			// Обновляем latitude
			if (Math.abs(ferry.latitude - ferry.to[1]) > step) {
				if (ferry.latitude < ferry.to[1]) {
					ferry.latitude += step; // Двигаемся вверх
				} else {
					ferry.latitude -= step; // Двигаемся вниз
				}
				reachedTarget = false;
			} else {
				ferry.latitude = ferry.to[1]; // Точная подгонка
			}

			// Если достигли цели, останавливаем интервал
			if (reachedTarget) {
				clearInterval(intervals[index]);
			}
		}, 5000);
	});

	return ferryData.value;
});
