import type { IProduct } from '@/types/product';

export default function () {
	return useState<IProduct[]>('cart', () => []);
}
