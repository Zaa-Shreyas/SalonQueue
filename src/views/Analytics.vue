<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p class="text-gray-600">Insights into your salon's performance and customer patterns</p>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Customers</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalCustomers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Revenue Today</p>
              <p class="text-2xl font-semibold text-gray-900">${{ todayRevenue }}</p>
            </div>
          </div>
        </div>

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
              <p class="text-sm font-medium text-gray-500">Avg Wait Time</p>
              <p class="text-2xl font-semibold text-gray-900">{{ avgWaitTime }}m</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Peak Hour</p>
              <p class="text-2xl font-semibold text-gray-900">{{ peakHour }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Daily Customers Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Daily Customer Volume</h2>
          <canvas ref="dailyChart" width="400" height="200"></canvas>
        </div>

        <!-- Hourly Distribution Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Hourly Distribution</h2>
          <canvas ref="hourlyChart" width="400" height="200"></canvas>
        </div>
      </div>

      <!-- Service Popularity and Wait Times -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Service Popularity -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Service Popularity</h2>
          <div class="space-y-4">
            <div 
              v-for="service in servicePopularity" 
              :key="service.service"
              class="flex items-center justify-between"
            >
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium text-gray-900">{{ service.service }}</span>
                  <span class="text-sm text-gray-500">{{ service.count }} customers</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    :style="{ width: service.percentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Wait Time Analysis -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Wait Time Analysis</h2>
          <canvas ref="waitTimeChart" width="400" height="200"></canvas>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-8 bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div class="p-6">
          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, index) in recentActivity" :key="index">
                <div class="relative pb-8" :class="{ 'pb-0': index === recentActivity.length - 1 }">
                  <span 
                    v-if="index !== recentActivity.length - 1"
                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  ></span>
                  <div class="relative flex space-x-3">
                    <div>
                      <span 
                        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        :class="{
                          'bg-green-500': activity.type === 'completed',
                          'bg-blue-500': activity.type === 'started',
                          'bg-yellow-500': activity.type === 'waiting',
                          'bg-red-500': activity.type === 'cancelled'
                        }"
                      >
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="activity.type === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          <path v-else-if="activity.type === 'started'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                          <path v-else-if="activity.type === 'waiting'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">
                          {{ activity.message }}
                        </p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        {{ activity.time }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useQueueStore } from '../stores/queue'
import { Chart, registerables } from 'chart.js'
import { format } from 'date-fns'

Chart.register(...registerables)

const queueStore = useQueueStore()
const dailyChart = ref<HTMLCanvasElement>()
const hourlyChart = ref<HTMLCanvasElement>()
const waitTimeChart = ref<HTMLCanvasElement>()

// Mock analytics data
const analyticsData = ref({
  dailyCustomers: [
    { date: '2024-01-15', customers: 45 },
    { date: '2024-01-16', customers: 52 },
    { date: '2024-01-17', customers: 38 },
    { date: '2024-01-18', customers: 61 },
    { date: '2024-01-19', customers: 48 },
    { date: '2024-01-20', customers: 55 },
    { date: '2024-01-21', customers: 42 }
  ],
  hourlyDistribution: [
    { hour: '9 AM', customers: 5 },
    { hour: '10 AM', customers: 12 },
    { hour: '11 AM', customers: 18 },
    { hour: '12 PM', customers: 15 },
    { hour: '1 PM', customers: 8 },
    { hour: '2 PM', customers: 14 },
    { hour: '3 PM', customers: 20 },
    { hour: '4 PM', customers: 16 },
    { hour: '5 PM', customers: 11 },
    { hour: '6 PM', customers: 19 },
    { hour: '7 PM', customers: 13 },
    { hour: '8 PM', customers: 7 }
  ],
  servicePopularity: [
    { service: 'Haircut', count: 156, percentage: 45 },
    { service: 'Hair Wash & Blow Dry', count: 89, percentage: 26 },
    { service: 'Beard Trim', count: 67, percentage: 19 },
    { service: 'Hair Color', count: 34, percentage: 10 }
  ]
})

const totalCustomers = computed(() => 
  analyticsData.value.dailyCustomers.reduce((sum, day) => sum + day.customers, 0)
)

const todayRevenue = computed(() => {
  const serviceRevenue = {
    'Haircut': 25,
    'Hair Wash & Blow Dry': 35,
    'Hair Color': 80,
    'Beard Trim': 15,
    'Facial': 50,
    'Manicure': 30,
    'Pedicure': 40
  }
  
  return queueStore.customers
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + (serviceRevenue[c.service as keyof typeof serviceRevenue] || 0), 0)
})

const avgWaitTime = computed(() => queueStore.averageWaitTime)

const peakHour = computed(() => {
  const peak = analyticsData.value.hourlyDistribution
    .reduce((max, hour) => hour.customers > max.customers ? hour : max)
  return peak.hour
})

const servicePopularity = computed(() => analyticsData.value.servicePopularity)

const recentActivity = computed(() => [
  { type: 'completed', message: 'Sarah Johnson completed Hair Color service', time: '2 min ago' },
  { type: 'started', message: 'Mike Davis started Beard Trim service', time: '5 min ago' },
  { type: 'waiting', message: 'Emily Chen joined the queue', time: '12 min ago' },
  { type: 'completed', message: 'John Smith completed Haircut service', time: '18 min ago' },
  { type: 'started', message: 'Lisa Wang started Facial service', time: '25 min ago' }
])

const createDailyChart = () => {
  if (!dailyChart.value) return
  
  new Chart(dailyChart.value, {
    type: 'line',
    data: {
      labels: analyticsData.value.dailyCustomers.map(d => format(new Date(d.date), 'MMM dd')),
      datasets: [{
        label: 'Customers',
        data: analyticsData.value.dailyCustomers.map(d => d.customers),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

const createHourlyChart = () => {
  if (!hourlyChart.value) return
  
  new Chart(hourlyChart.value, {
    type: 'bar',
    data: {
      labels: analyticsData.value.hourlyDistribution.map(h => h.hour),
      datasets: [{
        label: 'Customers',
        data: analyticsData.value.hourlyDistribution.map(h => h.customers),
        backgroundColor: '#F59E0B',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

const createWaitTimeChart = () => {
  if (!waitTimeChart.value) return
  
  new Chart(waitTimeChart.value, {
    type: 'doughnut',
    data: {
      labels: ['0-15 min', '15-30 min', '30-45 min', '45+ min'],
      datasets: [{
        data: [35, 40, 20, 5],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

onMounted(async () => {
  await nextTick()
  createDailyChart()
  createHourlyChart()
  createWaitTimeChart()
})
</script>