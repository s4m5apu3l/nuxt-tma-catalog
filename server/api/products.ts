export default defineEventHandler(() => {
	return [
		{
			id: 1,
			active: true,
			name: 'Adidas Ultraboost 23',
			category_slug: 'shoes',
			thumbnail:
				'https://img.freepik.com/free-photo/men-shoes_1203-8652.jpg?t=st=1736046725~exp=1736050325~hmac=3122d2f3e0daf954e9d8cecebb0a40a7289facd16b3a724fdd7bacf5a2eca077&w=1380',
			images: [
				{
					id: 1,
					url: 'https://img.freepik.com/free-photo/men-shoes_1203-8652.jpg?t=st=1736046725~exp=1736050325~hmac=3122d2f3e0daf954e9d8cecebb0a40a7289facd16b3a724fdd7bacf5a2eca077&w=1380',
				},
				{
					id: 2,
					url: 'https://picsum.photos/200/300',
				},
				{
					id: 3,
					url: 'https://picsum.photos/400/300',
				},
			],
			available: true,
			discount: 20,
			description: 'Легкие и удобные кроссовки для бега. Амортизация Boost.',
			sizes: [38, 39, 40, 41, 42, 43],
			size_actual: 40,
			features: 'Подходит для тренировок и повседневной носки.',
			price: 1000,
		},
		{
			id: 2,
			active: true,
			name: 'lorem ipsum dolor sit amet dsa dsa dsad sad alore dsa dsa dsa sada',
			category_slug: 'clothes',
			thumbnail:
				'https://img.freepik.com/free-photo/men-shoes_1203-8652.jpg?t=st=1736046725~exp=1736050325~hmac=3122d2f3e0daf954e9d8cecebb0a40a7289facd16b3a724fdd7bacf5a2eca077&w=1380',
			images: [
				{
					id: 1,
					url: 'https://img.freepik.com/free-photo/men-shoes_1203-8652.jpg?t=st=1736046725~exp=1736050325~hmac=3122d2f3e0daf954e9d8cecebb0a40a7289facd16b3a724fdd7bacf5a2eca077&w=1380',
				},
				{
					id: 2,
					url: 'https://picsum.photos/200/300',
				},
				{
					id: 3,
					url: 'https://picsum.photos/400/300',
				},
			],
			available: true,
			discount: null,
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nulla voluptates amet suscipit, quasi sed quam ipsam cum commodi, quis non quod molestias assumenda est? Est accusamus beatae perferendis rem.',
			sizes: [38, 39, 40, 41, 42, 43],
			size_actual: 40,
			features: 'Подходит для тренировок и повседневной носки.',
			price: 1000,
		},
		{
			id: 3,
			active: true,
			name: 'lorem',
			category_slug: 'accessories',
			thumbnail: 'https://picsum.photos/200/300',
			images: [
				{
					id: 1,
					url: 'https://img.freepik.com/free-photo/men-shoes_1203-8652.jpg?t=st=1736046725~exp=1736050325~hmac=3122d2f3e0daf954e9d8cecebb0a40a7289facd16b3a724fdd7bacf5a2eca077&w=1380',
				},
				{
					id: 2,
					url: 'https://picsum.photos/200/300',
				},
				{
					id: 3,
					url: 'https://picsum.photos/400/300',
				},
			],
			available: true,
			discount: 50,
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nulla voluptates amet suscipit, quasi sed quam ipsam cum commodi, quis non quod molestias assumenda est? Est accusamus beatae perferendis rem.',
			sizes: null,
			size_actual: 40,
			features: null,
			price: 100_000,
		},
	];
});
