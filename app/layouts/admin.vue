<script setup lang="ts">
const { locale, t } = useI18n()
const { logout, user } = useAuth()

useHead({
	htmlAttrs: {
		lang: locale
	}
})

const handleLogout = async (): Promise<void> => {
	await logout()
}
</script>

<template>
	<div class="min-h-screen bg-background">
		<UHeader class="border-b border-border">
			<template #left>
				<div class="flex items-center space-x-4">
					<NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
						<UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
						<span class="text-sm font-medium">{{ t('common.back_to_home') }}</span>
					</NuxtLink>
					<div class="flex items-center space-x-2">
						<UIcon name="i-lucide-shield-check" class="w-5 h-5 text-primary" />
						<span class="font-semibold">{{ t('admin.layout.adminPanel') }}</span>
					</div>
				</div>
			</template>

			<template #right>
				<div class="flex items-center space-x-3">
					<div class="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
						<UIcon name="i-lucide-user" class="w-4 h-4" />
						<span>{{ user?.name || user?.email || 'Admin' }}</span>
					</div>
					<UColorModeButton />
					<UButton
						icon="i-lucide-log-out"
						color="error"
						variant="ghost"
						size="sm"
						:title="t('admin.layout.logout')"
						@click="handleLogout"
					>
						<span class="hidden sm:inline">{{ t('admin.layout.logout') }}</span>
					</UButton>
				</div>
			</template>
		</UHeader>

		<div class="flex">
			<AdminSidebar />
			<main class="flex-1 min-h-[calc(100vh-4rem)]">
				<div class="p-6">
					<slot />
				</div>
			</main>
		</div>
	</div>
</template>
