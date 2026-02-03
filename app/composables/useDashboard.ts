interface DashboardStats {
	totalCategories: number
	totalProducts: number
	activeProducts: number
	inactiveProducts: number
	availableProducts: number
	unavailableProducts: number
}

interface RecentProduct {
	$id: string
	name: Record<'en' | 'ru', string>
	price: number
	priceUnit: string
	categoryId: string
	createdAt: string
	isActive: boolean
	isAvailable: boolean
}

const stats = ref<DashboardStats>({
	totalCategories: 0,
	totalProducts: 0,
	activeProducts: 0,
	inactiveProducts: 0,
	availableProducts: 0,
	unavailableProducts: 0
})

const recentProducts = ref<RecentProduct[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export const useDashboard = () => {
	const { fetchAllCategories, categories } = useCategories()
	const { fetchAllProducts, products } = useProducts()
	const { handleError } = useErrorHandler()

	const calculateStats = (): void => {
		const categoriesData = categories.value || []
		const productsData = products.value || []

		stats.value = {
			totalCategories: categoriesData.length,
			totalProducts: productsData.length,
			activeProducts: productsData.filter((p) => p.isActive).length,
			inactiveProducts: productsData.filter((p) => !p.isActive).length,
			availableProducts: productsData.filter((p) => p.isAvailable && p.isActive).length,
			unavailableProducts: productsData.filter((p) => !p.isAvailable || !p.isActive).length
		}

		// Get 5 most recent products
		const sortedProducts = [...productsData]
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 5)

		recentProducts.value = sortedProducts as RecentProduct[]
	}

	const fetchDashboardData = async (): Promise<void> => {
		loading.value = true
		error.value = null

		try {
			await Promise.all([fetchAllCategories(), fetchAllProducts()])
			calculateStats()
		} catch (err: any) {
			console.error('Error fetching dashboard data:', err)
			error.value = 'Failed to fetch dashboard data'
			handleError(err, 'Ошибка загрузки данных дашборда')
		} finally {
			loading.value = false
		}
	}

	const refreshStats = (): void => {
		calculateStats()
	}

	return {
		stats: readonly(stats),
		recentProducts: readonly(recentProducts),
		loading: readonly(loading),
		error: readonly(error),
		fetchDashboardData,
		refreshStats
	}
}
