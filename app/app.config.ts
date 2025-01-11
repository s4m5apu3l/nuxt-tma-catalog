export default defineAppConfig({
	ui: {
		colors: {
			primary: 'emerald',
			neutral: 'zinc',
		},

		carousel: {
			variants: {
				active: {
					true: {
						dot: 'bg-[var(--color-emerald-300)]',
					},
				},
			},
		},
	},
});
