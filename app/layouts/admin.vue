<script setup lang="ts">
const { locale, t } = useI18n()
const { logout, checkSession, sessionChecked } = useAuth()
const route = useRoute()

useHead({
	htmlAttrs: {
		lang: locale
	}
})

// Check session once on layout mount
onMounted(async () => {
	if (!sessionChecked.value) {
		const hasSession = await checkSession()
		if (!hasSession) {
			await navigateTo('/admin')
		}
	}
})

const handleLogout = async (): Promise<void> => {
	await logout()
}

const navItems = [
	{
		label: t('admin.nav.dashboard'),
		to: '/admin/dashboard',
		icon: 'i-lucide-layout-dashboard'
	},
	{
		label: t('admin.nav.categories'),
		to: '/admin/categories',
		icon: 'i-lucide-folder'
	},
	{
		label: t('admin.nav.products'),
		to: '/admin/products',
		icon: 'i-lucide-package'
	}
]

const isActiveRoute = (path: string): boolean => {
	if (path === '/admin/dashboard') {
		return route.path === path
	}
	return route.path.startsWith(path)
}
</script>

<template>
	<div class="min-h-screen bg-background pb-20">
		<header class="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
			<div class="flex items-center justify-between px-4 h-14">
				<div class="flex items-center space-x-2">
					<UIcon name="i-lucide-shield-check" class="w-5 h-5 text-primary" />
					<span class="font-semibold">{{ t('admin.layout.adminPanel') }}</span>
				</div>

				<div class="flex items-center space-x-2">
					<UColorModeButton />
					<UButton
						icon="i-lucide-log-out"
						color="error"
						variant="ghost"
						size="sm"
						:title="t('admin.layout.logout')"
						@click="handleLogout"
					/>
				</div>
			</div>
		</header>

		<main class="px-4 py-6">
			<slot />
		</main>

		<nav class="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border">
			<div class="flex items-center justify-around h-16">
				<NuxtLink
					v-for="item in navItems"
					:key="item.to"
					:to="item.to"
					class="flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors"
					:class="{
						'text-primary': isActiveRoute(item.to),
						'text-muted-foreground': !isActiveRoute(item.to)
					}"
				>
					<UIcon :name="item.icon" class="w-5 h-5" />
					<span class="text-xs font-medium">{{ item.label }}</span>
				</NuxtLink>
			</div>
		</nav>
	</div>
</template>
