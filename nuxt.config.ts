import Tailwind from '@tailwindcss/vite';

export default defineNuxtConfig({
	ssr: false,
	hooks: {
		'prerender:routes'({ routes }) {
			routes.clear();
		},
	},
	spaLoadingTemplate: 'spa-loading-template.html',

	// app configs
	devtools: { enabled: true },
	compatibilityDate: '2024-11-01',
	future: {
		compatibilityVersion: 4,
	},
	runtimeConfig: {
		apiUrl: '',
		tmaToken: process.env.TELEGRAM_BOT_TOKEN,
	},
	app: {
		rootTag: 'main',
		head: {
			title: 'TMA catalog',
			script: [
				{
					src: 'https://telegram.org/js/telegram-web-app.js',
				},
			],
		},
		rootAttrs: {
			// 'vaul-drawer-wrapper': '',
			class: 'bg-[var(--ui-bg)]',
		},
	},

	modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/image', '@nuxtjs/supabase'],
	css: ['~/assets/css/main.css'],
	vite: {
		plugins: [Tailwind()],
	},

	ui: {
		theme: {
			colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
		},
	},
	supabase: {
		redirect: false,
	},
});
