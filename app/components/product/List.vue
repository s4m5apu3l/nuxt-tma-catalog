<script setup lang="ts"></script>

<template>
	<section>
		<template v-if="loading">loading</template>
		<template v-else-if="isError">error</template>
		<template v-else>
			<slot />
		</template>
	</section>
</template>
