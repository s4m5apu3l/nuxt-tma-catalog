export default function () {
	const sizes = reactive({
		browserWidth: window.innerWidth,
		deviceWidth: screen.width,
		isMobile: false,
	});

	const browserResized = () => {
		sizes.browserWidth = window.innerWidth;
		sizes.deviceWidth = screen.width;
		sizes.isMobile = isMobile();
	};

	const isMobile = () => {
		return window.innerWidth <= 600 ? true : false;
	};

	onMounted(() => {
		window.addEventListener('resize', useDebounce(browserResized, 300));
	});

	onUnmounted(() => {
		window.removeEventListener('resize', browserResized);
	});

	// return {
	// 	...toRefs(sizes),
	// };
	return sizes;
}
