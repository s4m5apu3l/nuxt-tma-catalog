<template>
	<UCard class="category-skeleton">
		<div class="flex items-center space-x-4">
			<USkeleton class="h-12 w-12 rounded-full shrink-0" />
			<div class="flex-1 space-y-2">
				<USkeleton class="h-5 w-3/4" />
				<USkeleton class="h-4 w-full" />
				<USkeleton class="h-3 w-1/2" />
			</div>
			<USkeleton class="h-4 w-4 shrink-0" />
		</div>
	</UCard>
</template>

<style scoped>
.category-skeleton {
	@apply border border-gray-200 dark:border-gray-700;
}
</style>
