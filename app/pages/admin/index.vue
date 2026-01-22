<script setup lang="ts">
// Set page meta to use admin layout
definePageMeta({
	middleware: 'auth',
	layout: 'admin'
})

// Use composables
const { user } = useAuth()
const { categories, fetchCategories } = useCategories()
const { products, fetchProducts } = useProducts()
const { t } = useI18n()

// Fetch data on mount
onMounted(async () => {
	await Promise.all([fetchCategories(), fetchProducts()])
})

// Set page title
useHead({
	title: t('admin.dashboard')
})
</script>

<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="border-b border-gray-200 pb-5">
			<div>
				<h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
					{{ $t('admin.dashboard') }}
				</h1>
				<p class="mt-1 text-sm text-gray-500">{{ $t('welcome') }}, {{ user?.name || user?.email }}</p>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			<UCard>
				<div class="flex items-center">
					<div class="shrink-0">
						<UIcon name="i-lucide-folder" class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">
								{{ $t('admin.categories.title') }}
							</dt>
							<dd class="text-lg font-medium text-gray-900">
								{{ categories.length }}
							</dd>
						</dl>
					</div>
				</div>
				<template #footer>
					<NuxtLink to="/admin/categories" class="font-medium text-primary-700 hover:text-primary-900">
						{{ $t('common.edit') }}
					</NuxtLink>
				</template>
			</UCard>

			<UCard>
				<div class="flex items-center">
					<div class="shrink-0">
						<UIcon name="i-lucide-package" class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">
								{{ $t('admin.products.title') }}
							</dt>
							<dd class="text-lg font-medium text-gray-900">
								{{ products.length }}
							</dd>
						</dl>
					</div>
				</div>
				<template #footer>
					<NuxtLink to="/admin/products" class="font-medium text-primary-700 hover:text-primary-900">
						{{ $t('common.edit') }}
					</NuxtLink>
				</template>
			</UCard>

			<UCard>
				<div class="flex items-center">
					<div class="shrink-0">
						<UIcon name="i-lucide-user" class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">
								{{ $t('admin.title') }}
							</dt>
							<dd class="text-lg font-medium text-gray-900">
								{{ user?.name || 'Admin' }}
							</dd>
						</dl>
					</div>
				</div>
				<template #footer>
					<span class="font-medium text-gray-500">
						{{ user?.email }}
					</span>
				</template>
			</UCard>
		</div>

		<!-- Quick Actions -->
		<UCard>
			<template #header>
				<h3 class="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
			</template>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<UButton to="/admin/categories" icon="i-lucide-plus" size="lg" class="justify-start">
					{{ $t('admin.categories.add') }}
				</UButton>
				<UButton to="/admin/products" icon="i-lucide-plus" size="lg" class="justify-start">
					{{ $t('admin.products.add') }}
				</UButton>
			</div>
		</UCard>
	</div>
</template>
