<script setup lang="ts">
interface NavigationItem {
	label: string
	to: string
	icon: string
	badge?: string | number
}

const { t } = useI18n()
const route = useRoute()

const navigationItems: NavigationItem[] = [
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
	<aside class="w-64 min-h-screen bg-muted/30 border-r border-border">
		<div class="p-6">
			<div class="flex items-center space-x-3 mb-8">
				<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
					<UIcon name="i-lucide-store" class="w-5 h-5 text-primary-foreground" />
				</div>
				<div>
					<h2 class="font-semibold text-foreground">TMA Catalog</h2>
					<p class="text-xs text-muted-foreground">{{ t('admin.layout.adminPanel') }}</p>
				</div>
			</div>

			<nav class="space-y-2">
				<NuxtLink
					v-for="item in navigationItems"
					:key="item.to"
					:to="item.to"
					class="flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors group"
					:class="{
						'bg-primary text-primary-foreground shadow-sm': isActiveRoute(item.to),
						'text-muted-foreground hover:text-foreground hover:bg-muted': !isActiveRoute(item.to)
					}"
				>
					<UIcon
						:name="item.icon"
						class="w-4 h-4 mr-3 shrink-0"
						:class="{
							'text-primary-foreground': isActiveRoute(item.to),
							'text-muted-foreground group-hover:text-foreground': !isActiveRoute(item.to)
						}"
					/>
					<span class="font-medium">{{ item.label }}</span>
					<UBadge
						v-if="item.badge"
						:label="item.badge.toString()"
						size="xs"
						color="primary"
						variant="solid"
						class="ml-auto"
					/>
				</NuxtLink>
			</nav>
		</div>
	</aside>
</template>
