<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to access the admin dashboard
        </p>
      </div>
      
      <UForm 
        :schema="loginSchema" 
        :state="formState" 
        class="mt-8 space-y-6"
        @submit="handleSubmit"
      >
        <div class="space-y-4">
          <UFormGroup label="Email" name="email" required>
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="Enter your email"
              :disabled="isLoading"
              autocomplete="email"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UInput
              v-model="formState.password"
              type="password"
              placeholder="Enter your password"
              :disabled="isLoading"
              autocomplete="current-password"
            />
          </UFormGroup>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <UIcon name="i-heroicons-x-circle" class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <div>
          <UButton
            type="submit"
            :loading="isLoading"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

// Define page meta for authentication
definePageMeta({
  layout: false,
  middleware: 'guest'
})

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

// Form state
const formState = reactive({
  email: '',
  password: ''
})

// Use auth composable
const { login, isLoading, error, clearError } = useAuth()

// Handle form submission
const handleSubmit = async () => {
  clearError()
  
  const success = await login({
    email: formState.email,
    password: formState.password
  })

  if (success) {
    // Redirect to admin dashboard
    await navigateTo('/admin')
  }
}

// Clear error when user starts typing
watch([() => formState.email, () => formState.password], () => {
  if (error.value) {
    clearError()
  }
})
</script>