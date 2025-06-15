import Tailwind from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },

	modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/scripts', '@nuxt/ui', '@vite-pwa/nuxt', '@nuxt/icon'],

	ssr: false,
	hooks: {
		'prerender:routes'({ routes }) {
			routes.clear();
		},
	},
	spaLoadingTemplate: 'spa-loading-template.html',

	future: {
		compatibilityVersion: 4,
	},

	runtimeConfig: {
		public: {
			keyMap: process.env.MAPGL,
		},
	},

	css: ['~/assets/css/main.css'],

	icon: {
		mode: 'css',
		cssLayer: 'base',
	},

	vite: {
		plugins: [Tailwind()],
	},

	ui: {
		theme: {
			colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
		},
	},

	app: {
		head: {
			title: 'Моторки Якутии',
			script: [
				{
					src: 'https://mapgl.2gis.com/api/js/v1',
					defer: true,
				},
			],
		},
	},
});
