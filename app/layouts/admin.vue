<script setup>
const { locale } = useI18n()
const { user, logout } = useAuth()

// Redirect if not authenticated or not admin
const router = useRouter()
onMounted(() => {
	if (!user.value || !user.value.isAdmin) {
		router.push('/')
	}
})

useHead({
	htmlAttrs: {
		lang: locale
	}
})

const adminNavigation = [
	{
		label: 'Dashboard',
		to: '/admin',
		icon: 'i-lucide-layout-dashboard'
	},
	{
		label: 'Categories',
		to: '/admin/categories',
		icon: 'i-lucide-folder'
	},
	{
		label: 'Products',
		to: '/admin/products',
		icon: 'i-lucide-package'
	}
]

const handleLogout = async () => {
	await logout()
	router.push('/')
}
</script>

<template>
	<div class="min-h-screen bg-background">
		<UHeader>
			<template #left>
				<NuxtLink to="/" class="flex items-center">
					<AppLogo class="w-auto h-6 shrink-0" />
				</NuxtLink>
				<span class="ml-4 text-sm text-muted">Admin Panel</span>
			</template>

			<template #right>
				<LanguageSwitcher />
				<UColorModeButton />
				<UButton
					@click="handleLogout"
					icon="i-lucide-log-out"
					color="red"
					variant="ghost"
					size="sm"
				>
					Logout
				</UButton>
			</template>
		</UHeader>

		<div class="flex">
			<!-- Sidebar Navigation -->
			<aside class="w-64 min-h-screen bg-muted/30 border-r">
				<nav class="p-4">
					<ul class="space-y-2">
						<li v-for="item in adminNavigation" :key="item.to">
							<NuxtLink
								:to="item.to"
								class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
								active-class="bg-primary text-primary-foreground"
							>
								<UIcon :name="item.icon" class="w-4 h-4 mr-3" />
								{{ item.label }}
							</NuxtLink>
						</li>
					</ul>
				</nav>
			</aside>

			<!-- Main Content -->
			<main class="flex-1">
				<UContainer class="py-8">
					<slot />
				</UContainer>
			</main>
		</div>
	</div>
</template>