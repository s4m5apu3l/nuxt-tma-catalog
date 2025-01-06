export function useFormatPrice(price: number) {
	if (typeof price !== 'number') return;
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0,
	}).format(price);
}
