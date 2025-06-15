<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-700 to-accent-400 py-12">
    <div class="max-w-md mx-auto px-4">
      <div class="card animate-slide-up">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Join the Queue</h1>
          <p class="text-gray-600">Enter your details to get in line</p>
        </div>

        <form @submit.prevent="submitRegistration" class="space-y-6">
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

          <div>
            <label for="service" class="block text-sm font-medium text-gray-700 mb-2">
              Service Needed
            </label>
            <select
              id="service"
              v-model="form.service"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">Select a service</option>
              <option v-for="service in queueStore.services" :key="service.id" :value="service.name">
                {{ service.name }} - {{ service.duration }}min - ₹{{ service.price }}
              </option>
            </select>
          </div>

          <div class="bg-gray-200 p-4 rounded-lg">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Current wait time:</span>
              <span class="font-semibold text-primary-600">{{ estimatedWait }} minutes</span>
            </div>
            <div class="flex items-center justify-between text-sm mt-1">
              <span class="text-gray-600">People in queue:</span>
              <span class="font-semibold text-primary-600">{{ queueStore.waitingCount }}</span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Joining Queue...' : 'Join Queue' }}
          </button>
        </form>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQueueStore } from '../stores/queue'
import { mockServices } from '../utils/mockData'

const router = useRouter()
const queueStore = useQueueStore()

const loading = ref(false)
const form = ref({
  name: '',
  phone: '',
  service: ''
})

const activeCustomers = computed(() => {
  return queueStore.customers
    ?.filter(c => c.status === 'waiting' || c.status === 'in-progress')
    ?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || []
})

const estimatedWait = computed(() => {
  if (!form.value.service) return 0

  const selectedService = queueStore.services.find(s => s.name === form.value.service)
  if (!selectedService) return 0

  let totalTime = 0
  const now = new Date().getTime()

  for (const customer of activeCustomers.value) {
    const service = queueStore.services.find(s => s.name === customer.service)
    const duration = service?.duration || 15

    if (customer.status === 'in-progress') {
      const startedAt = new Date(customer.started_at || customer.created_at).getTime()
      const elapsedMinutes = Math.floor((now - startedAt) / (1000 * 60))
      const remaining = Math.max(0, duration - elapsedMinutes)
      totalTime += remaining
    } else {
      // for 'waiting' customers, full time counts
      totalTime += duration
    }
  }

  return totalTime
})



const submitRegistration = async () => {
  loading.value = true
  
  try {
    const customer = await queueStore.addCustomer({
      name: form.value.name,
      phone: form.value.phone,
      service: form.value.service,
      status: 'waiting',
      estimated_wait: estimatedWait.value
    })
    
    // Redirect to queue status page
    router.push(`/queue/${customer.id}`)
  } catch (error) {
    console.error('Registration failed:', error)
    alert('Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Load services if not already loaded
  if (queueStore.services.length === 0) {
    queueStore.services.push(...mockServices)
  }
})
</script>