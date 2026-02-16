<script setup lang="ts">
import type { LoginCredentials } from '~/types'

definePageMeta({
	layout: false
})

const { t } = useI18n()
const { login, loading, error, checkSession } = useAuth()

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

onMounted(async () => {
	const hasSession = await checkSession()
	if (hasSession) {
		await navigateTo('/admin/dashboard')
	}
})
</script>

<template>
	<UApp>
		<div class="min-h-screen flex items-center justify-center bg-background px-4 py-8">
			<div class="w-full max-w-sm space-y-6">
				<div class="text-center space-y-3">
					<div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
						<UIcon name="i-lucide-shield-check" class="w-8 h-8 text-primary" />
					</div>
					<div>
						<h1 class="text-2xl font-bold text-foreground">
							{{ t('admin.login.title') }}
						</h1>
						<p class="text-sm text-muted-foreground mt-1">
							{{ t('admin.login.subtitle') }}
						</p>
					</div>
				</div>

				<UCard>
					<form class="space-y-4" @submit.prevent="handleLogin">
						<UFormField :label="t('admin.login.email')" :error="formErrors.email" required>
							<UInput
								v-model="form.email"
								type="email"
								size="lg"
								class="w-full input-no-zoom"
								:placeholder="t('admin.login.emailPlaceholder')"
								:disabled="loading"
								@keypress="handleKeyPress"
							/>
						</UFormField>

						<UFormField :label="t('admin.login.password')" :error="formErrors.password" required>
							<UInput
								v-model="form.password"
								type="password"
								size="lg"
								class="w-full input-no-zoom"
								:placeholder="t('admin.login.passwordPlaceholder')"
								:disabled="loading"
								@keypress="handleKeyPress"
							/>
						</UFormField>

						<UAlert v-if="error" color="error" variant="soft" :title="error" />

						<UButton type="submit" :loading="loading" :disabled="loading" color="primary" size="lg" block>
							{{ t('admin.login.submit') }}
						</UButton>
					</form>
				</UCard>

				<div class="text-center">
					<NuxtLink to="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
						{{ t('admin.login.backToCatalog') }}
					</NuxtLink>
				</div>
			</div>
		</div>
	</UApp>
</template>

<style scoped>
.input-no-zoom :deep(input) {
	font-size: 16px !important;
}
</style>
