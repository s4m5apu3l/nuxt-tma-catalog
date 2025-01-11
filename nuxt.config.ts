import Tailwind from '@tailwindcss/vite';

export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/image'],
	css: ['~/assets/css/main.css'],
	hooks: {
		'prerender:routes'({ routes }) {
			routes.clear(); // Не создает никаких маршрутов (кроме значений по умолчанию)
		},
	},
	spaLoadingTemplate: 'spa-loading-template.html',
	future: {
		compatibilityVersion: 4,
	},
	vite: {
		plugins: [Tailwind()],
	},
	runtimeConfig: {
		apiUrl: '',
	},

	ui: {
		theme: {
			colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
		},
	},

	app: {
		rootTag: 'main',
		head: {
			title: 'TWA nuxt4',
		},
		rootAttrs: {
			'vaul-drawer-wrapper': '',
			class: 'bg-[var(--ui-bg)]',
		},
	},
});
