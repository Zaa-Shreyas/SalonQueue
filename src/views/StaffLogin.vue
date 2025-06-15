<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-700 to-accent-400 py-12">
    <div class="max-w-md mx-auto px-4">
      <div class="card animate-slide-up">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Staff Login</h1>
          <p class="text-gray-600">Enter your credentials to access the dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="+91-xxx-xxx-xxxx"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 text-sm">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full btn-primary flex items-center justify-center"
          >
            <svg v-if="authStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="mt-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h3>
            <div class="text-xs text-gray-600 space-y-1">
              <p><strong>Manager:</strong> John Manager, +1234567890</p>
              <p><strong>Staff:</strong> Sarah Staff, +1234567891</p>
              <p><strong>Barber:</strong> Mike Barber, +1234567892</p>
            </div>
          </div>
        </div>

        <div class="mt-6 text-center">
          <router-link to="/" class="text-primary-600 hover:text-primary-700 text-sm">
            ← Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  phone: ''
})

const error = ref('')

const handleLogin = async () => {
  error.value = ''
  
  try {
    await authStore.login(form.value.name, form.value.phone)
    router.push('/staff')
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please check your credentials.'
  }
}
</script>