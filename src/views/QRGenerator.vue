<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-300 to-purple-200 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">QR Code Management</h1>
        <p class="text-gray-600">Generate and manage QR codes for your salon</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- QR Code Generator -->
        <div class="bg-violet-300 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Generate QR Code</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                QR Code Type
              </label>
              <select 
                v-model="selectedType" 
                class="w-full px-3 py-2 border border-gray-300 bg-rose-100 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="registration">Customer Registration</option>
                <option value="status">Queue Status Check</option>
                <option value="feedback">Feedback Form</option>
              </select>
            </div>

            <div v-if="selectedType === 'registration'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pre-select Service (Optional)
              </label>
              <select 
                v-model="preSelectedService"
                class="w-full px-3 py-2 border border-gray-300 bg-rose-100 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">No pre-selection</option>
                <option v-for="service in services" :key="service.id" :value="service.name">
                  {{ service.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Custom Message (Optional)
              </label>
              <input
                v-model="customMessage"
                type="text"
                placeholder="e.g., Scan to join our queue!"
                class="w-full px-3 py-2 border border-gray-300 bg-rose-100 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              @click="generateQR"
              class="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
            >
              Generate QR Code
            </button>
          </div>
        </div>

        <!-- QR Code Display -->
        <div class="bg-violet-300 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Generated QR Code</h2>
          
          <div v-if="currentQR" class="text-center">
            <div class="mb-4">
              <canvas ref="qrCanvas" class="mx-auto border rounded-lg"></canvas>
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-600 mb-2">{{ qrDescription }}</p>
              <p class="text-xs text-gray-500 break-all">{{ currentQR.url }}</p>
            </div>

            <div class="flex gap-2">
              <button
                @click="downloadQR"
                class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Download PNG
              </button>
              <button
                @click="printQR"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Print
              </button>
            </div>
          </div>

          <div v-else class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <p>Generate a QR code to display it here</p>
          </div>
        </div>
      </div>

      <!-- QR Scanner Section -->
      <div class="mt-8 bg-violet-300 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">QR Code Scanner</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div class="mb-4">
              <button
                @click="toggleScanner"
                :class="[
                  'w-full py-3 px-4 rounded-md font-medium transition-colors',
                  scannerActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
                ]"
              >
                {{ scannerActive ? 'Stop Scanner' : 'Start Scanner' }}
              </button>
            </div>
            
            <div 
              v-show="scannerActive"
              class="relative bg-gray-100 rounded-lg overflow-hidden"
              style="aspect-ratio: 1;"
            >
              <video 
                ref="videoElement" 
                class="w-full h-full object-cover"
                autoplay 
                muted 
                playsinline
              ></video>
              <div class="absolute inset-0 border-4 border-primary-500 rounded-lg pointer-events-none">
                <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Scanner Results</h3>
            
            <div v-if="scanResult" class="space-y-4">
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 class="font-medium text-green-900 mb-2">QR Code Detected!</h4>
                <p class="text-sm text-green-800 break-all">{{ scanResult.data }}</p>
                
                <div class="mt-3 flex gap-2">
                  <button
                    @click="processQRResult"
                    class="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Process
                  </button>
                  <button
                    @click="clearScanResult"
                    class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div v-else-if="scannerActive" class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Scanning for QR codes...</p>
              <p class="text-sm mt-1">Point your camera at a QR code</p>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>Scanner is ready</p>
              <p class="text-sm mt-1">Click "Start Scanner" to begin</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent QR Codes -->
      <div class="mt-8 bg-violet-300 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent QR Codes</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="qr in recentQRs" 
            :key="qr.id"
            class="border border-gray-200 bg-rose-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
            @click="selectQR(qr)"
          >
            <div class="text-center mb-3">
              <div class="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 class="font-medium text-gray-900">{{ qr.type }}</h3>
              <p class="text-sm text-gray-500">{{ qr.createdAt }}</p>
            </div>
            <p class="text-xs text-gray-600 truncate">{{ qr.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'

const router = useRouter()

const selectedType = ref('registration')
const preSelectedService = ref('')
const customMessage = ref('')
const currentQR = ref<any>(null)
const qrCanvas = ref<HTMLCanvasElement>()
const videoElement = ref<HTMLVideoElement>()
const scannerActive = ref(false)
const scanResult = ref<any>(null)

const services = ref([
  { id: '1', name: 'Haircut' },
  { id: '2', name: 'Hair Wash & Blow Dry' },
  { id: '3', name: 'Hair Color' },
  { id: '4', name: 'Beard Trim' },
  { id: '5', name: 'Facial' },
  { id: '6', name: 'Manicure' },
  { id: '7', name: 'Pedicure' }
])

const recentQRs = ref([
  {
    id: '1',
    type: 'Registration',
    description: 'Customer registration with Haircut pre-selected',
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    type: 'Status Check',
    description: 'Queue status checker',
    createdAt: '1 hour ago'
  },
  {
    id: '3',
    type: 'Feedback',
    description: 'Customer feedback form',
    createdAt: '30 min ago'
  }
])

const qrDescription = computed(() => {
  if (!currentQR.value) return ''
  
  switch (currentQR.value.type) {
    case 'registration':
      return 'Customers can scan this to join the queue'
    case 'status':
      return 'Customers can scan this to check their queue status'
    case 'feedback':
      return 'Customers can scan this to leave feedback'
    default:
      return 'QR Code generated'
  }
})

const generateQR = async () => {
  try {
    let url = window.location.origin
    let description = customMessage.value

    switch (selectedType.value) {
      case 'registration':
        url += '/register'
        if (preSelectedService.value) {
          url += `?service=${encodeURIComponent(preSelectedService.value)}`
        }
        if (!description) description = 'Scan to join the salon queue'
        break
      case 'status':
        url += '/queue'
        if (!description) description = 'Scan to check queue status'
        break
      case 'feedback':
        url += '/?feedback=true'
        if (!description) description = 'Scan to leave feedback'
        break
    }

    currentQR.value = {
      type: selectedType.value,
      url,
      description,
      createdAt: new Date().toISOString()
    }

    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    }
  } catch (error) {
    console.error('Error generating QR code:', error)
    alert('Failed to generate QR code')
  }
}

const downloadQR = () => {
  if (!qrCanvas.value) return
  
  const link = document.createElement('a')
  link.download = `salon-qr-${selectedType.value}-${Date.now()}.png`
  link.href = qrCanvas.value.toDataURL()
  link.click()
}

const printQR = () => {
  if (!qrCanvas.value) return
  
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Salon QR Code</title>
          <style>
            body { 
              text-align: center; 
              font-family: Arial, sans-serif; 
              margin: 20px;
            }
            .qr-container {
              border: 2px solid #333;
              padding: 20px;
              display: inline-block;
              margin: 20px;
            }
            .description {
              margin-top: 15px;
              font-size: 18px;
              font-weight: bold;
            }
            .url {
              margin-top: 10px;
              font-size: 12px;
              color: #666;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${qrCanvas.value.toDataURL()}" alt="QR Code" />
            <div class="description">${qrDescription.value}</div>
            <div class="url">${currentQR.value?.url}</div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

const toggleScanner = async () => {
  if (scannerActive.value) {
    stopScanner()
  } else {
    await startScanner()
  }
}

const startScanner = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    })
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      scannerActive.value = true
      
      // Start scanning for QR codes
      startQRDetection()
    }
  } catch (error) {
    console.error('Error starting camera:', error)
    alert('Unable to access camera. Please check permissions.')
  }
}

const stopScanner = () => {
  if (videoElement.value?.srcObject) {
    const stream = videoElement.value.srcObject as MediaStream
    stream.getTracks().forEach(track => track.stop())
    videoElement.value.srcObject = null
  }
  scannerActive.value = false
}

const startQRDetection = () => {
  // Simple QR detection simulation
  // In production, use a library like qr-scanner or jsQR
  const detectInterval = setInterval(() => {
    if (!scannerActive.value) {
      clearInterval(detectInterval)
      return
    }
    
    // Simulate QR detection for demo
    if (Math.random() > 0.95 && !scanResult.value) {
      simulateQRDetection()
    }
  }, 1000)
}

const simulateQRDetection = () => {
  // Simulate different types of QR codes being scanned
  const mockQRs = [
    { data: `${window.location.origin}/register`, type: 'registration' },
    { data: `${window.location.origin}/queue/abc123`, type: 'status' },
    { data: `${window.location.origin}/?feedback=true`, type: 'feedback' }
  ]
  
  const randomQR = mockQRs[Math.floor(Math.random() * mockQRs.length)]
  scanResult.value = randomQR
}

const processQRResult = () => {
  if (!scanResult.value) return
  
  try {
    const url = new URL(scanResult.value.data)
    const path = url.pathname
    const search = url.search
    
    // Navigate to the scanned URL
    router.push(path + search)
  } catch (error) {
    console.error('Invalid QR code URL:', error)
    alert('Invalid QR code detected')
  }
}

const clearScanResult = () => {
  scanResult.value = null
}

const selectQR = (qr: any) => {
  // Load previous QR code
  currentQR.value = qr
  // You could regenerate the QR canvas here
}

onMounted(() => {
  // Generate default QR code
  generateQR()
})

onUnmounted(() => {
  stopScanner()
})
</script>