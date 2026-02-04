export const formatPrice = (price: number, unit: string): string => {
	return `${price.toLocaleString()} ${unit}`
}
