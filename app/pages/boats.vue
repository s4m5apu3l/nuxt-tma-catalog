<script setup lang="ts">
interface Motorboat {
	id: number;
	name: string;
	description: string;
	pricePerHour: number;
	imageUrl: string;
}

const motorboats: Motorboat[] = [
	{
		id: 1,
		name: 'Якутская Стрела',
		description: 'Компактная моторка для рыбалки и прогулок. Идеальна для небольших рек Якутии. Вместимость: до 4 человек.',
		pricePerHour: 1500,
		imageUrl: 'https://cdn1.youla.io/files/images/720_720_out/67/0f/670f750997c967fbe702c7bb-2.jpg',
	},
	{
		id: 2,
		name: 'Ленский Ветер',
		description: 'Мощная лодка для скоростных поездок по реке Лена. Подходит для групп до 6 человек.',
		pricePerHour: 2500,
		imageUrl: 'https://cdn1.youla.io/files/images/720_720_out/67/ea/67ea3baed33025248903bbeb-2.jpg',
	},
	{
		id: 3,
		name: 'Северный Охотник',
		description: 'Прочная моторка для охоты и экспедиций. Оснащена дополнительным местом для снаряжения.',
		pricePerHour: 2000,
		imageUrl: '',
	},
	{
		id: 4,
		name: 'Алданская Волна',
		description: 'Комфортная лодка для семейных прогулок. Вместимость: до 5 человек, с тентом от дождя.',
		pricePerHour: 1800,
		imageUrl: '',
	},
	{
		id: 5,
		name: 'Тундровый Ястреб',
		description: 'Легкая и маневренная моторка для труднодоступных водоемов. Идеальна для одиночных поездок.',
		pricePerHour: 1200,
		imageUrl: '',
	},
	{
		id: 6,
		name: 'Сибирский Гигант',
		description: 'Большая моторка для корпоративных выездов. Вместимость: до 10 человек, с мини-кухней.',
		pricePerHour: 3500,
		imageUrl: '',
	},
];
</script>

<template>
	<div class="l-wrapper">
		<div class="py-3">
			<h1 class="text-[2rem] font-bold">Наши моторки</h1>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				<article
					v-for="boat in motorboats"
					:key="boat.id"
					class="border rounded-lg shadow-md p-4 bg-white dark:bg-zinc-800 hover:shadow-lg transition-shadow"
				>
					<img :src="boat.imageUrl" :alt="boat.name" class="w-full h-48 object-cover rounded-md mb-4" />
					<h2 class="text-xl font-semibold">{{ boat.name }}</h2>
					<p class="text-gray-600 dark:text-gray-300 mt-2">{{ boat.description }}</p>
					<p class="text-lg font-bold mt-4">Цена: {{ boat.pricePerHour }} ₽/час</p>
				</article>
			</div>
		</div>
	</div>
</template>
