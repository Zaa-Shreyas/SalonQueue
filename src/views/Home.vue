<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
    <!-- Hero Section -->
    <section class="pt-20 pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Skip the Wait,
            <span class="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Love Your Look
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
            Join the queue digitally, track your wait time in real-time, and explore nearby deals while you wait. 
            The future of salon appointments is here.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <router-link to="/register" class="btn-primary text-lg">
              Join Queue Now
            </router-link>
            <button @click="scanQR" class="btn-secondary text-lg">
              Scan QR Code
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-16">
          Why Choose SalonQueue?
        </h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Real-Time Updates</h3>
            <p class="text-gray-600">
              Get live updates on your queue position and estimated wait time. Never wonder when it's your turn again.
            </p>
          </div>

          <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Smart Scheduling</h3>
            <p class="text-gray-600">
              AI-powered wait time estimation based on service type, queue length, and historical data patterns.
            </p>
          </div>

          <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Nearby Deals</h3>
            <p class="text-gray-600">
              Discover exclusive offers from nearby restaurants, cafes, and shops while you wait for your appointment.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Queue Stats -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-16">
          Live Queue Status
        </h2>
        
        <div class="grid md:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-yellow-600 mb-2">{{ queueStore.waitingCount }}</div>
            <div class="text-gray-600">Waiting</div>
          </div>
          
          <div class="bg-white rounded-xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ queueStore.inProgressCount }}</div>
            <div class="text-gray-600">In Progress</div>
          </div>
          
          <div class="bg-white rounded-xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ queueStore.completedCount }}</div>
            <div class="text-gray-600">Completed Today</div>
          </div>
          
          <div class="bg-white rounded-xl p-6 text-center shadow-lg">
            <div class="text-3xl font-bold text-purple-600 mb-2">{{ queueStore.averageWaitTime }}m</div>
            <div class="text-gray-600">Avg Wait Time</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-white mb-6">
          Ready to Transform Your Salon Experience?
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          Join thousands of satisfied customers who have discovered the smart way to wait.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/register" class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
            Get Started Now
          </router-link>
          <router-link to="/staff" class="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
            Staff Login
          </router-link>
        </div>
      </div>
    </section>

    <!-- QR Scanner Modal -->
    <div v-if="showQRScanner" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Scan QR Code</h3>
        <div id="qr-scanner" class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <p class="text-gray-500">Camera loading...</p>
        </div>
        <div class="flex gap-3">
          <button @click="closeQRScanner" class="btn-secondary flex-1">
            Cancel
          </button>
          <router-link to="/register" @click="closeQRScanner" class="btn-primary flex-1 text-center">
            Manual Entry
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQueueStore } from '../stores/queue'

const router = useRouter()
const queueStore = useQueueStore()
const showQRScanner = ref(false)

const scanQR = () => {
  showQRScanner.value = true
  // In a real implementation, initialize QR scanner here
  setTimeout(() => {
    // Simulate QR scan - redirect to registration
    router.push('/register')
    showQRScanner.value = false
  }, 3000)
}

const closeQRScanner = () => {
  showQRScanner.value = false
}

onMounted(() => {
  // Initialize with mock data if needed
  if (queueStore.customers.length === 0) {
    queueStore.fetchCustomers()
  }
})
</script>