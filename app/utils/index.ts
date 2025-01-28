export function useFormatPrice(price: number) {
	if (typeof price !== 'number') return;
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0,
	}).format(price);
}

// export function useDebounce(fn, wait) {
// 	let timer;
// 	return function (...args) {
// 		if (timer) clearTimeout(timer);

// 		const context = this;
// 		timer = setTimeout(() => {
// 			fn.apply(context, args);
// 		}, wait);
// 	};
// }

export function useDebounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number,
	immediate?: boolean
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
		const context = this;

		const later = () => {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};

		const callNow = immediate && !timeout;

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(context, args);
		}
	};
}
