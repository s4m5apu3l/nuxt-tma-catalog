<script setup lang="ts">
interface TransportService {
	id: number;
	route: string;
	distance: number;
	price: number;
}

const services: TransportService[] = [
	{
		id: 1,
		route: 'Якутск - Олёкминск',
		distance: 650,
		price: 25000,
	},
	{
		id: 2,
		route: 'Якутск - Намцы',
		distance: 85,
		price: 5000,
	},
	{
		id: 3,
		route: 'Якутск - Жиганск',
		distance: 600,
		price: 22000,
	},
	{
		id: 4,
		route: 'Якутск - Покровск',
		distance: 80,
		price: 4500,
	},
	{
		id: 5,
		route: 'Якутск - Ленск',
		distance: 840,
		price: 30000,
	},
	{
		id: 6,
		route: 'Якутск - Тикси (морской маршрут)',
		distance: 1200,
		price: 45000,
	},
];
</script>

<template>
	<div class="l-wrapper">
		<div class="py-3">
			<h1 class="text-[2rem] font-bold">Тарифы на перевозки</h1>
			<div class="mt-6 overflow-x-auto">
				<table class="w-full border-collapse bg-white dark:bg-zinc-500 rounded-lg shadow-md">
					<thead>
						<tr class="bg-zinc-100 dark:bg-zinc-700">
							<th class="p-4 text-left text-gray-700 dark:text-gray-200">Маршрут</th>
							<th class="p-4 text-left text-gray-700 dark:text-gray-200">Расстояние (км)</th>
							<th class="p-4 text-left text-gray-700 dark:text-gray-200">Цена (₽)</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="service in services"
							:key="service.id"
							class="border-t border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700"
						>
							<td class="p-4 text-gray-600 dark:text-gray-300">{{ service.route }}</td>
							<td class="p-4 text-gray-600 dark:text-gray-300">{{ service.distance }}</td>
							<td class="p-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{{ service.price.toLocaleString() }} ₽</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<style scoped>
table {
	min-width: 100%;
}

th,
td {
	text-align: left;
	font-size: 1rem;
}

th {
	font-weight: 600;
}
</style>
