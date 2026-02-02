export const useErrorHandler = () => {
	const toast = useToast()

	const handleError = (error: Error | string, title = 'Error') => {
		console.error('Error:', error)

		const message = typeof error === 'string' ? error : error.message || 'Something went wrong'

		toast.add({
			title,
			description: message,
			color: 'error'
		})
	}

	const handleSuccess = (message: string, title = 'Success') => {
		toast.add({
			title,
			description: message,
			color: 'success'
		})
	}

	const handleInfo = (message: string, title = 'Info') => {
		toast.add({
			title,
			description: message,
			color: 'info'
		})
	}

	return {
		handleError,
		handleSuccess,
		handleInfo
	}
}
