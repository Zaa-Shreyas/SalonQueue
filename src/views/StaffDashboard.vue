<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p class="text-gray-600">Manage the salon queue and customer flow</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Waiting</p>
              <p class="text-2xl font-semibold text-gray-900">{{ waitingCustomers.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">In Progress</p>
              <p class="text-2xl font-semibold text-gray-900">{{ inProgressCustomers.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Completed Today</p>
              <p class="text-2xl font-semibold text-gray-900">{{ completedToday }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Avg Wait Time</p>
              <p class="text-2xl font-semibold text-gray-900">{{ averageWaitTime }}m</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Queue Management -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Waiting Queue -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Waiting Queue</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div 
                v-for="customer in waitingCustomers" 
                :key="customer.id"
                class="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ customer.name }}</h3>
                    <p class="text-sm text-gray-600">{{ customer.service }}</p>
                    <p class="text-xs text-gray-500">{{ customer.phone }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-yellow-600">
                      {{ getWaitTime(customer) }}m wait
                    </p>
                    <p class="text-xs text-gray-500">
                      Position {{ customer.position || getPosition(customer) }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2 mt-3">
                  <button 
                    @click="startService(customer)"
                    class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    Start Service
                  </button>
                  <button 
                    @click="removeCustomer(customer)"
                    class="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div v-if="waitingCustomers.length === 0" class="text-center py-8 text-gray-500">
                No customers waiting
              </div>
            </div>
          </div>
        </div>

        <!-- In Progress -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">In Progress</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div 
                v-for="customer in inProgressCustomers" 
                :key="customer.id"
                class="p-4 border border-blue-200 bg-blue-50 rounded-lg"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ customer.name }}</h3>
                    <p class="text-sm text-gray-600">{{ customer.service }}</p>
                    <p class="text-xs text-gray-500">{{ customer.phone }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-blue-600">
                      {{ getServiceTime(customer) }}m elapsed
                    </p>
                  </div>
                </div>
                <div class="flex gap-2 mt-3">
                  <button 
                    @click="completeService(customer)"
                    class="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Complete
                  </button>
                  <button 
                    @click="pauseService(customer)"
                    class="px-3 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                  >
                    Pause
                  </button>
                </div>
              </div>
              
              <div v-if="inProgressCustomers.length === 0" class="text-center py-8 text-gray-500">
                No services in progress
              </div>
            </div>
          </div>
        </div>

        <!-- Recently Completed -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Recently Completed</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div 
                v-for="customer in recentlyCompleted" 
                :key="customer.id"
                class="p-4 border border-green-200 bg-green-50 rounded-lg"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ customer.name }}</h3>
                    <p class="text-sm text-gray-600">{{ customer.service }}</p>
                    <p class="text-xs text-gray-500">
                      Completed {{ formatTime(customer.completed_at) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-green-600">
                      {{ customer.actual_wait || customer.estimated_wait }}m total
                    </p>
                  </div>
                </div>
              </div>
              
              <div v-if="recentlyCompleted.length === 0" class="text-center py-8 text-gray-500">
                No recent completions
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="flex flex-wrap gap-4">
          <button 
            @click="callNextCustomer"
            class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Call Next Customer
          </button>
          <button 
            @click="broadcastMessage"
            class="bg-accent-600 text-white px-4 py-2 rounded-md hover:bg-accent-700 transition-colors"
          >
            Send Announcement
          </button>
          <button 
            @click="exportData"
            class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Export Today's Data
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Sound -->
    <audio ref="notificationSound" preload="auto">
      <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNXGtlLGqsaGzqKuftbKovLajuLaquayurKuzsYq/raKnsau/rKKntraqsbKvsKW1trCtsa+zr7avrrOzs7Wvs7Kvs7KvtK+0r7OvtKWvs62wrrKstKyysK6zpq2zpbCzrLKtsbGzr7Kxsa6xsbCusKytsaW0qrClsKOyobKjr6eysKWxoqaoo6emoqmkpaihp6aho6Oko6ChpKGhpqGgpKOgoqSgn6OhoJ2jn6Cio6CcpJ6foqGenJ+foZyen5+dn5+dnZ+dnZyenZ2cnZybnJucnJucnJucnJucnJubnJuam5uam5q" type="audio/wav">
    </audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQueueStore } from '../stores/queue'
import { format } from 'date-fns'

const queueStore = useQueueStore()
const notificationSound = ref<HTMLAudioElement>()

const waitingCustomers = computed(() => 
  queueStore.customers.filter(c => c.status === 'waiting')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
)

const inProgressCustomers = computed(() => 
  queueStore.customers.filter(c => c.status === 'in-progress')
)

const recentlyCompleted = computed(() => 
  queueStore.customers
    .filter(c => c.status === 'completed')
    .sort((a, b) => new Date(b.completed_at || b.created_at).getTime() - 
                    new Date(a.completed_at || a.created_at).getTime())
    .slice(0, 5)
)

const completedToday = computed(() => {
  const today = new Date().toDateString()
  return queueStore.customers.filter(c => 
    c.status === 'completed' && 
    new Date(c.completed_at || c.created_at).toDateString() === today
  ).length
})

const averageWaitTime = computed(() => {
  const completed = queueStore.customers.filter(c => c.status === 'completed')
  if (completed.length === 0) return 0
  const total = completed.reduce((sum, c) => sum + (c.actual_wait || c.estimated_wait), 0)
  return Math.round(total / completed.length)
})

const getPosition = (customer: any) => {
  return waitingCustomers.value.findIndex(c => c.id === customer.id) + 1
}

const getWaitTime = (customer: any) => {
  const position = getPosition(customer)
  const baseWait = 15 // minutes per customer ahead
  return customer.estimated_wait || (position * baseWait)
}

const getServiceTime = (customer: any) => {
  if (!customer.started_at) return 0
  const now = new Date()
  const started = new Date(customer.started_at)
  return Math.round((now.getTime() - started.getTime()) / (1000 * 60))
}

const formatTime = (dateString?: string) => {
  if (!dateString) return 'Just now'
  return format(new Date(dateString), 'HH:mm')
}

const startService = async (customer: any) => {
  try {
    await queueStore.updateCustomerStatus(customer.id, 'in-progress')
    playNotification()
  } catch (error) {
    console.error('Error starting service:', error)
  }
}

const completeService = async (customer: any) => {
  try {
    const actualWait = customer.started_at ? 
      Math.round((new Date().getTime() - new Date(customer.started_at).getTime()) / (1000 * 60)) :
      customer.estimated_wait

    await queueStore.updateCustomerStatus(customer.id, 'completed')
    playNotification()
  } catch (error) {
    console.error('Error completing service:', error)
  }
}

const pauseService = async (customer: any) => {
  try {
    await queueStore.updateCustomerStatus(customer.id, 'waiting')
  } catch (error) {
    console.error('Error pausing service:', error)
  }
}

const removeCustomer = async (customer: any) => {
  if (confirm(`Remove ${customer.name} from the queue?`)) {
    try {
      await queueStore.updateCustomerStatus(customer.id, 'completed')
    } catch (error) {
      console.error('Error removing customer:', error)
    }
  }
}

const callNextCustomer = () => {
  if (waitingCustomers.value.length > 0) {
    const nextCustomer = waitingCustomers.value[0]
    startService(nextCustomer)
  }
}

const broadcastMessage = () => {
  const message = prompt('Enter message to broadcast to all customers:')
  if (message) {
    // In a real implementation, this would send notifications
    alert(`Message broadcasted: "${message}"`)
  }
}

const exportData = () => {
  const today = new Date().toDateString()
  const todaysCustomers = queueStore.customers.filter(c => 
    new Date(c.created_at).toDateString() === today
  )
  
  const csvContent = [
    'Name,Phone,Service,Status,Wait Time,Created At',
    ...todaysCustomers.map(c => 
      `${c.name},${c.phone},${c.service},${c.status},${c.actual_wait || c.estimated_wait},${c.created_at}`
    )
  ]
  
  const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `salon-data-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const playNotification = () => {
  if (notificationSound.value) {
    notificationSound.value.play().catch(console.error)
  }
}

onMounted(() => {
  queueStore.fetchCustomers()
  
  // Auto-refresh every 30 seconds
  const interval = setInterval(() => {
    queueStore.fetchCustomers()
  }, 30000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>