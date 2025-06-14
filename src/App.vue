<template>
  <div id="app">
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">SQ</span>
              </div>
              <span class="text-xl font-bold text-gray-900">SalonQueue</span>
            </router-link>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link
              to="/"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'Home' }"
            >
              Home
            </router-link>
            <router-link
              to="/staff"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'StaffDashboard' }"
            >
              Staff
            </router-link>
            <router-link
              to="/analytics"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'Analytics' }"
            >
              Analytics
            </router-link>
            <router-link
              to="/qr"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'QRGenerator' }"
            >
              QR Code
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="min-h-screen">
      <router-view />
    </main>

    <footer class="bg-gray-50 border-t border-gray-200">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-gray-600">
            &copy; 2024 SalonQueue. Revolutionizing salon wait times.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQueueStore } from './stores/queue'

const queueStore = useQueueStore()

onMounted(() => {
  queueStore.initSocket()
  queueStore.fetchServices()
  queueStore.fetchCustomers()
})
</script>