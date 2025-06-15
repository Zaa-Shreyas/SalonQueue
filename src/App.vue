<template>
  <div id="app">
    <nav class="bg-accent-600 shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span class="text-highlight-600 font-bold text-sm">SQ</span>
              </div>
              <span class="text-xl font-bold text-gray-900">SalonQueue</span>
            </router-link>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link
              to="/"
              class="text-accent-50 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-primary-600 bg-accent-600': $route.name === 'Home' }"
            >
              Home
            </router-link>
            
            <template v-if="authStore.isAuthenticated">
              <router-link
                to="/staff"
                class="text-accent-50 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-primary-600 bg-accent-600': $route.name === 'StaffDashboard' }"
              >
                Staff
              </router-link>
              <router-link
                to="/analytics"
                class="text-accent-50 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-primary-600 bg-accent-600': $route.name === 'Analytics' }"
              >
                Analytics
              </router-link>
              <router-link
                to="/qr"
                class="text-accent-50 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-primary-600 bg-accent-600': $route.name === 'QRGenerator' }"
              >
                QR Code
              </router-link>
              <button
                @click="handleLogout"
                class="text-accent-50 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout ({{ authStore.currentStaff?.name }})
              </button>
            </template>
            
            <template v-else>
              <router-link
                to="/staff-login"
                class="text-accent-50 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-primary-600 bg-accent-600': $route.name === 'StaffLogin' }"
              >
                Staff Login
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="min-h-screen">
      <router-view />
    </main>

    <footer class="bg-accent-600 border-t border-tertiary-100">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-gray-600">
            Revolutionizing salon wait times.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQueueStore } from './stores/queue'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const queueStore = useQueueStore()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  authStore.checkAuth()
  queueStore.initSocket()
  queueStore.fetchServices()
  queueStore.fetchCustomers()
})
</script>