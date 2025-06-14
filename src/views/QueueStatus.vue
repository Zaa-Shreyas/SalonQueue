<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-100 to-accent-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Customer Info Card -->
      <div class="card mb-8 animate-slide-up">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ customer?.name || 'Loading...' }}</h1>
            <p class="text-gray-600">{{ customer?.service }}</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-primary-600">
              {{ customer?.position || 0 }}
            </div>
            <div class="text-sm text-gray-500">Position in queue</div>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-yellow-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-yellow-600 mb-1">
              {{ customer?.estimated_wait || 0 }}m
            </div>
            <div class="text-sm text-gray-600">Estimated Wait</div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-lg font-semibold text-blue-600 mb-1 capitalize">
              {{ customer?.status || 'waiting' }}
            </div>
            <div class="text-sm text-gray-600">Current Status</div>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600 mb-1">
              {{ formatTime(customer?.created_at) }}
            </div>
            <div class="text-sm text-gray-600">Joined At</div>
          </div>
        </div>

        <!-- Status Progress -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Progress</span>
            <span class="text-sm text-gray-500">{{ statusProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: statusProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Live Queue Updates -->
      <div class="card mb-8">
        <h2 class="text-xl font-semibold mb-4">Live Queue</h2>
        <div class="space-y-3">
          <div 
            v-for="queueCustomer in queueCustomers" 
            :key="queueCustomer.id"
            class="flex items-center justify-between p-3 rounded-lg transition-colors"
            :class="{
              'bg-blue-100 border-2 border-blue-300': queueCustomer.id === customerId,
              'bg-gray-50': queueCustomer.id !== customerId
            }"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                   :class="{
                     'bg-yellow-200 text-yellow-800': queueCustomer.status === 'waiting',
                     'bg-blue-200 text-blue-800': queueCustomer.status === 'in-progress',
                     'bg-green-200 text-green-800': queueCustomer.status === 'completed'
                   }">
                {{ queueCustomer.position || '✓' }}
              </div>
              <div>
                <div class="font-medium">{{ queueCustomer.name }}</div>
                <div class="text-sm text-gray-500">{{ queueCustomer.service }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="status-badge" :class="{
                'status-waiting': queueCustomer.status === 'waiting',
                'status-in-progress': queueCustomer.status === 'in-progress',
                'status-completed': queueCustomer.status === 'completed'
              }">
                {{ queueCustomer.status.replace('-', ' ') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nearby Deals -->
      <div class="card mb-8">
        <h2 class="text-xl font-semibold mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Nearby Deals While You Wait
        </h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div v-for="deal in nearbyDeals" :key="deal.id" class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img :src="deal.image" :alt="deal.title" class="w-full h-32 object-cover" />
            <div class="p-4">
              <h3 class="font-semibold mb-2">{{ deal.title }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ deal.description }}</p>
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>📍 {{ deal.distance }}</span>
                <span>⏰ {{ deal.validUntil }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4">
        <button @click="refreshStatus" class="btn-primary flex-1">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Status
        </button>
        <button @click="cancelAppointment" class="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQueueStore } from '../stores/queue'
import { mockDeals, mockCustomers } from '../utils/mockData'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const queueStore = useQueueStore()

const customerId = computed(() => route.params.customerId as string)
const customer = computed(() => queueStore.currentCustomer || mockCustomers.find(c => c.id === customerId.value))
const nearbyDeals = ref(mockDeals)

const queueCustomers = computed(() => 
  queueStore.customers.length > 0 ? queueStore.customers : mockCustomers
)

const statusProgress = computed(() => {
  if (!customer.value) return 0
  switch (customer.value.status) {
    case 'waiting': return 33
    case 'in-progress': return 66
    case 'completed': return 100
    default: return 0
  }
})

const formatTime = (dateString?: string) => {
  if (!dateString) return '--:--'
  return format(new Date(dateString), 'HH:mm')
}

const refreshStatus = async () => {
  if (customerId.value) {
    await queueStore.getCustomerById(customerId.value)
  }
  await queueStore.fetchCustomers()
}

const cancelAppointment = async () => {
  if (confirm('Are you sure you want to cancel your appointment?')) {
    if (customerId.value) {
      await queueStore.updateCustomerStatus(customerId.value, 'completed')
    }
    router.push('/')
  }
}

let refreshInterval: any

onMounted(async () => {
  if (customerId.value) {
    await queueStore.getCustomerById(customerId.value)
  }
  
  // Auto-refresh every 30 seconds
  refreshInterval = setInterval(refreshStatus, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>