<script setup lang="ts">
definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const { t } = useI18n()

// TODO: Implement product creation form
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center space-x-3">
			<UButton icon="i-lucide-arrow-left" variant="ghost" size="sm" to="/admin/products" />
			<h1 class="text-xl font-bold text-foreground">
				{{ t('admin.products.create') }}
			</h1>
		</div>

		<UCard>
			<div class="text-center py-8 text-muted-foreground">
				<UIcon name="i-lucide-package-plus" class="w-12 h-12 mx-auto mb-3 opacity-50" />
				<p>{{ t('admin.products.createForm') }}</p>
			</div>
		</UCard>
	</div>
</template>
