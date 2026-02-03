<script setup lang="ts">
definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const { t, locale } = useI18n()
const { user } = useAuth()
const { stats, recentProducts, loading, fetchDashboardData } = useDashboard()

onMounted(() => {
	fetchDashboardData()
})

const formatDate = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}

const formatPrice = (price: number, unit: string): string => {
	return `${price} ${unit}`
}

const statsCards = computed(() => [
	{
		title: t('admin.dashboard.categories'),
		value: stats.value.totalCategories,
		icon: 'i-lucide-folder',
		color: 'blue',
		to: '/admin/categories'
	},
	{
		title: t('admin.dashboard.products'),
		value: stats.value.totalProducts,
		icon: 'i-lucide-package',
		color: 'green',
		to: '/admin/products'
	},
	{
		title: t('admin.dashboard.active'),
		value: stats.value.activeProducts,
		icon: 'i-lucide-eye',
		color: 'emerald',
		to: '/admin/products?filter=active'
	},
	{
		title: t('admin.dashboard.inactive'),
		value: stats.value.inactiveProducts,
		icon: 'i-lucide-eye-off',
		color: 'red',
		to: '/admin/products?filter=inactive'
	}
])
</script>

<template>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-foreground">
					{{ t('admin.dashboard.title') }}
				</h1>
				<p class="text-muted-foreground mt-1">
					{{ t('admin.dashboard.welcome', { name: user?.name || user?.email || 'Admin' }) }}
				</p>
			</div>
			<UButton
				icon="i-lucide-refresh-cw"
				variant="outline"
				size="sm"
				:loading="loading"
				@click="fetchDashboardData"
			>
				{{ t('common.refresh') }}
			</UButton>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<UCard
				v-for="card in statsCards"
				:key="card.title"
				class="hover:shadow-md transition-shadow cursor-pointer"
				@click="navigateTo(card.to)"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-muted-foreground">{{ card.title }}</p>
						<p class="text-2xl font-bold text-foreground mt-1">
							<template v-if="loading">-</template>
							<template v-else>{{ card.value }}</template>
						</p>
					</div>
					<div
						class="w-12 h-12 rounded-lg flex items-center justify-center"
						:class="{
							'bg-blue-100 dark:bg-blue-900/20': card.color === 'blue',
							'bg-green-100 dark:bg-green-900/20': card.color === 'green',
							'bg-emerald-100 dark:bg-emerald-900/20': card.color === 'emerald',
							'bg-red-100 dark:bg-red-900/20': card.color === 'red'
						}"
					>
						<UIcon
							:name="card.icon"
							class="w-6 h-6"
							:class="{
								'text-blue-600 dark:text-blue-400': card.color === 'blue',
								'text-green-600 dark:text-green-400': card.color === 'green',
								'text-emerald-600 dark:text-emerald-400': card.color === 'emerald',
								'text-red-600 dark:text-red-400': card.color === 'red'
							}"
						/>
					</div>
				</div>
			</UCard>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<UCard>
				<template #header>
					<div class="flex items-center space-x-2">
						<UIcon name="i-lucide-zap" class="w-5 h-5 text-primary" />
						<h3 class="text-lg font-semibold">{{ t('admin.dashboard.quickActions') }}</h3>
					</div>
				</template>

				<div class="space-y-3">
					<UButton
						to="/admin/categories/create"
						color="primary"
						variant="outline"
						block
						icon="i-lucide-folder-plus"
						size="lg"
					>
						{{ t('admin.dashboard.addCategory') }}
					</UButton>

					<UButton
						to="/admin/products/create"
						color="primary"
						variant="outline"
						block
						icon="i-lucide-package-plus"
						size="lg"
					>
						{{ t('admin.dashboard.addProduct') }}
					</UButton>
				</div>
			</UCard>

			<UCard>
				<template #header>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<UIcon name="i-lucide-clock" class="w-5 h-5 text-primary" />
							<h3 class="text-lg font-semibold">{{ t('admin.dashboard.recentProducts') }}</h3>
						</div>
						<UButton to="/admin/products" variant="ghost" size="sm" icon="i-lucide-arrow-right" trailing>
							{{ t('common.view_all') }}
						</UButton>
					</div>
				</template>

				<div class="space-y-3">
					<template v-if="loading">
						<div v-for="i in 3" :key="i" class="flex items-center space-x-3">
							<USkeleton class="w-10 h-10 rounded" />
							<div class="flex-1 space-y-2">
								<USkeleton class="h-4 w-3/4" />
								<USkeleton class="h-3 w-1/2" />
							</div>
						</div>
					</template>

					<template v-else-if="recentProducts.length > 0">
						<div
							v-for="product in recentProducts"
							:key="product.$id"
							class="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
							@click="navigateTo(`/admin/products/${product.$id}`)"
						>
							<div class="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
								<UIcon name="i-lucide-package" class="w-5 h-5 text-muted-foreground" />
							</div>
							<div class="flex-1 min-w-0">
								<p class="font-medium text-foreground truncate">
									{{ product.name[locale] || product.name.en }}
								</p>
								<div class="flex items-center space-x-2 text-sm text-muted-foreground">
									<span>{{ formatPrice(product.price, product.priceUnit) }}</span>
									<span>•</span>
									<span>{{ formatDate(product.createdAt) }}</span>
								</div>
							</div>
							<div class="flex items-center space-x-1">
								<UBadge :color="product.isActive ? 'success' : 'error'" variant="soft" size="xs">
									{{ product.isActive ? t('admin.dashboard.active') : t('admin.dashboard.inactive') }}
								</UBadge>
							</div>
						</div>
					</template>

					<template v-else>
						<div class="text-center py-8 text-muted-foreground">
							<UIcon name="i-lucide-package" class="w-12 h-12 mx-auto mb-3 opacity-50" />
							<p>{{ t('admin.dashboard.noRecentProducts') }}</p>
						</div>
					</template>
				</div>
			</UCard>
		</div>
	</div>
</template>
