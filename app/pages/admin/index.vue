<script setup lang="ts">
import type { LoginCredentials } from '~/types'

definePageMeta({
	layout: 'admin'
})

const { t } = useI18n()
const { login, loading, error, isAuthenticated } = useAuth()

// Redirect if already authenticated
if (isAuthenticated.value) {
	await navigateTo('/admin/dashboard')
}

const form = ref<LoginCredentials>({
	email: '',
	password: ''
})

const formErrors = ref<Record<string, string>>({})

const validateForm = (): boolean => {
	formErrors.value = {}

	if (!form.value.email) {
		formErrors.value.email = t('admin.login.errors.emailRequired')
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
		formErrors.value.email = t('admin.login.errors.emailInvalid')
	}

	if (!form.value.password) {
		formErrors.value.password = t('admin.login.errors.passwordRequired')
	} else if (form.value.password.length < 6) {
		formErrors.value.password = t('admin.login.errors.passwordTooShort')
	}

	return Object.keys(formErrors.value).length === 0
}

const handleLogin = async (): Promise<void> => {
	if (!validateForm()) {
		return
	}

	const success = await login(form.value)

	if (success) {
		await navigateTo('/admin/dashboard')
	}
}

const handleKeyPress = (event: KeyboardEvent): void => {
	if (event.key === 'Enter') {
		handleLogin()
	}
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<div>
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					{{ t('admin.login.title') }}
				</h2>
				<p class="mt-2 text-center text-sm text-gray-600">
					{{ t('admin.login.subtitle') }}
				</p>
			</div>

			<UCard>
				<form class="space-y-6" @submit.prevent="handleLogin">
					<div>
						<UFormGroup :label="t('admin.login.email')" :error="formErrors.email" required>
							<UInput
								v-model="form.email"
								type="email"
								:placeholder="t('admin.login.emailPlaceholder')"
								:disabled="loading"
								@keypress="handleKeyPress"
							/>
						</UFormGroup>
					</div>

					<div>
						<UFormGroup :label="t('admin.login.password')" :error="formErrors.password" required>
							<UInput
								v-model="form.password"
								type="password"
								:placeholder="t('admin.login.passwordPlaceholder')"
								:disabled="loading"
								@keypress="handleKeyPress"
							/>
						</UFormGroup>
					</div>

					<div v-if="error" class="text-red-600 text-sm text-center">
						{{ error }}
					</div>

					<div>
						<UButton type="submit" :loading="loading" :disabled="loading" color="primary" size="lg" block>
							{{ t('admin.login.submit') }}
						</UButton>
					</div>
				</form>
			</UCard>
		</div>
	</div>
</template>
