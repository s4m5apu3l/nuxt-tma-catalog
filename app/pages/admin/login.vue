<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<div>
				<div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
					<Icon name="i-lucide-shield-check" class="h-6 w-6 text-primary-600" />
				</div>
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					{{ $t('admin.login.title') }}
				</h2>
			</div>

			<form class="mt-8 space-y-6" @submit.prevent="handleLogin">
				<div class="space-y-4">
					<div>
						<ULabel for="email">{{ $t('admin.login.email') }}</ULabel>
						<UInput
							id="email"
							v-model="formState.email"
							type="email"
							:placeholder="$t('admin.login.email')"
							:disabled="isLoading"
							autocomplete="email"
							required
						/>
					</div>

					<div>
						<ULabel for="password">{{ $t('admin.login.password') }}</ULabel>
						<UInput
							id="password"
							v-model="formState.password"
							type="password"
							:placeholder="$t('admin.login.password')"
							:disabled="isLoading"
							autocomplete="current-password"
							required
						/>
					</div>
				</div>

				<div v-if="error" class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<Icon name="i-lucide-alert-circle" class="h-5 w-5 text-red-400" />
						<div class="ml-3">
							<p class="text-sm text-red-800">{{ error }}</p>
						</div>
					</div>
				</div>

				<div>
					<UButton type="submit" :loading="isLoading" :disabled="isLoading" class="w-full" size="lg">
						{{ isLoading ? $t('admin.login.loading') : $t('admin.login.submit') }}
					</UButton>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
	middleware: 'guest',
	layout: false
})

// Use auth composable
const { login, isLoading, error, clearError } = useAuth()
const { t } = useI18n()
const route = useRoute()

// Form state
const formState = reactive({
	email: '',
	password: ''
})

// Handle login
const handleLogin = async () => {
	clearError()

	const success = await login(formState.email, formState.password)

	if (success) {
		// Redirect to intended page or admin dashboard
		const redirectTo = (route.query.redirect as string) || '/admin'
		await navigateTo(redirectTo)
	}
}

// Set page title
useHead({
	title: t('admin.login.title')
})
</script>
