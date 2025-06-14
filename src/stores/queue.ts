import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { io } from 'socket.io-client'

export interface Customer {
  id: string
  name: string
  phone: string
  service: string
  status: 'waiting' | 'in-progress' | 'completed'
  estimated_wait: number
  created_at: string
  position?: number
}

export interface Service {
  id: string
  name: string
  duration: number
  price: number
}

export const useQueueStore = defineStore('queue', () => {
  const customers = ref<Customer[]>([])
  const services = ref<Service[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const socket = ref<any>(null)

  // Initialize socket connection
  const initSocket = () => {
    socket.value = io('http://localhost:3001')
    
    socket.value.on('queueUpdate', (data: Customer[]) => {
      customers.value = data
      updatePositions()
    })
    
    socket.value.on('customerUpdate', (customer: Customer) => {
      const index = customers.value.findIndex(c => c.id === customer.id)
      if (index !== -1) {
        customers.value[index] = customer
      }
    })
  }

  const updatePositions = () => {
    const waitingCustomers = customers.value
      .filter(c => c.status === 'waiting')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    
    waitingCustomers.forEach((customer, index) => {
      customer.position = index + 1
    })
  }

  const waitingCount = computed(() => 
    customers.value.filter(c => c.status === 'waiting').length
  )

  const inProgressCount = computed(() => 
    customers.value.filter(c => c.status === 'in-progress').length
  )

  const completedCount = computed(() => 
    customers.value.filter(c => c.status === 'completed').length
  )

  const averageWaitTime = computed(() => {
    const waitingCustomers = customers.value.filter(c => c.status === 'waiting')
    if (waitingCustomers.length === 0) return 0
    return Math.round(waitingCustomers.reduce((sum, c) => sum + c.estimated_wait, 0) / waitingCustomers.length)
  })

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      customers.value = data || []
      updatePositions()
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name')

      if (error) throw error
      services.value = data || []
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'position'>) => {
    try {
      const estimatedWait = calculateEstimatedWait(customerData.service)
      
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          ...customerData,
          estimated_wait: estimatedWait,
          status: 'waiting'
        }])
        .select()
        .single()

      if (error) throw error
      
      // Emit update to all clients
      socket.value?.emit('customerAdded', data)
      
      return data
    } catch (error) {
      console.error('Error adding customer:', error)
      throw error
    }
  }

  const updateCustomerStatus = async (customerId: string, status: Customer['status']) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ status })
        .eq('id', customerId)
        .select()
        .single()

      if (error) throw error
      
      // Emit update to all clients
      socket.value?.emit('customerUpdated', data)
      
      return data
    } catch (error) {
      console.error('Error updating customer status:', error)
      throw error
    }
  }

  const calculateEstimatedWait = (serviceName: string): number => {
    const service = services.value.find(s => s.name === serviceName)
    const baseDuration = service?.duration || 30
    
    const waitingCustomers = customers.value.filter(c => c.status === 'waiting')
    const inProgressCustomers = customers.value.filter(c => c.status === 'in-progress')
    
    // Simple ML-like calculation
    const queueLength = waitingCustomers.length
    const activeServices = inProgressCustomers.length
    const peakMultiplier = getPeakMultiplier()
    
    return Math.round(baseDuration + (queueLength * 15) + (activeServices * 10) * peakMultiplier)
  }

  const getPeakMultiplier = (): number => {
    const hour = new Date().getHours()
    // Peak hours: 10-12 AM, 2-4 PM, 6-8 PM
    if ((hour >= 10 && hour < 12) || (hour >= 14 && hour < 16) || (hour >= 18 && hour < 20)) {
      return 1.5
    }
    return 1
  }

  const getCustomerById = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single()

      if (error) throw error
      currentCustomer.value = data
      return data
    } catch (error) {
      console.error('Error fetching customer:', error)
      throw error
    }
  }

  return {
    customers,
    services,
    currentCustomer,
    waitingCount,
    inProgressCount,
    completedCount,
    averageWaitTime,
    initSocket,
    fetchCustomers,
    fetchServices,
    addCustomer,
    updateCustomerStatus,
    getCustomerById
  }
})