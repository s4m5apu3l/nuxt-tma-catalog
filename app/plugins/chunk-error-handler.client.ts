export default defineNuxtPlugin(() => {
	const originalError = console.error

	console.error = (...args) => {
		const error = args[0]
		if (error instanceof Error && error.message.includes('error loading dynamically imported module')) {
			window.location.reload()
			return
		}
		originalError(...args)
	}

	window.addEventListener('error', (event) => {
		if (
			event.message?.includes('error loading dynamically imported module') ||
			event.message?.includes('Loading chunk') ||
			event.message?.includes('Loading CSS chunk')
		) {
			event.preventDefault()
			window.location.reload()
		}
	})

	window.addEventListener('unhandledrejection', (event) => {
		const error = event.reason
		if (
			error?.message?.includes('error loading dynamically imported module') ||
			error?.message?.includes('Loading chunk')
		) {
			event.preventDefault()
			window.location.reload()
		}
	})
})
