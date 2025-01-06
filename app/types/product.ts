export interface IProduct {
	id: number;
	active: boolean;
	name: string;
	category_slug: string;
	thumbnail: string;
	images: { id: number; url: string }[];
	available: boolean;
	discount: number | null;
	description: string;
	sizes: number[] | null;
	size_actual: number;
	features: string | null;
	price: number;
}
