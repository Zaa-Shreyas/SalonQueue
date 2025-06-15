import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export interface Staff {
  id: string
  name: string
  phone: string
  role: string
  created_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const currentStaff = ref<Staff | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  const login = async (name: string, phone: string) => {
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('name', name)
        .eq('phone', phone)
        .single()

      if (error) {
        // Try with mock data fallback
        const mockStaff = [
          { id: '1', name: 'John Manager', phone: '+1234567890', role: 'manager', created_at: new Date().toISOString() },
          { id: '2', name: 'Sarah Staff', phone: '+1234567891', role: 'staff', created_at: new Date().toISOString() },
          { id: '3', name: 'Mike Barber', phone: '+1234567892', role: 'staff', created_at: new Date().toISOString() }
        ]
        
        const staff = mockStaff.find(s => s.name === name && s.phone === phone)
        if (!staff) {
          throw new Error('Invalid credentials')
        }
        
        currentStaff.value = staff
        isAuthenticated.value = true
        localStorage.setItem('staff', JSON.stringify(staff))
        return staff
      }

      currentStaff.value = data
      isAuthenticated.value = true
      localStorage.setItem('staff', JSON.stringify(data))
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    currentStaff.value = null
    isAuthenticated.value = false
    localStorage.removeItem('staff')
  }

  const checkAuth = () => {
    const stored = localStorage.getItem('staff')
    if (stored) {
      try {
        currentStaff.value = JSON.parse(stored)
        isAuthenticated.value = true
      } catch (error) {
        localStorage.removeItem('staff')
      }
    }
  }

  return {
    currentStaff,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  }
})