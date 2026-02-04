<template>
	<UCard>
		<div class="flex items-center gap-4 p-4 sm:p-6">
			<!-- Icon Skeleton -->
			<div class="shrink-0">
				<USkeleton class="h-12 w-12 rounded-full" />
			</div>

			<!-- Content Skeleton -->
			<div class="flex-1 space-y-2">
				<USkeleton class="h-5 w-3/4" />
				<USkeleton class="h-4 w-full" />
				<USkeleton class="h-3 w-1/3" />
			</div>

			<!-- Arrow Skeleton -->
			<div class="shrink-0">
				<USkeleton class="h-5 w-5" />
			</div>
		</div>
	</UCard>
</template>
