import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import CustomerRegistration from '../views/CustomerRegistration.vue'
import QueueStatus from '../views/QueueStatus.vue'
import StaffLogin from '../views/StaffLogin.vue'
import StaffDashboard from '../views/StaffDashboard.vue'
import Analytics from '../views/Analytics.vue'
import QRGenerator from '../views/QRGenerator.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'CustomerRegistration',
      component: CustomerRegistration
    },
    {
      path: '/queue/:customerId?',
      name: 'QueueStatus',
      component: QueueStatus,
      props: true
    },
    {
      path: '/staff-login',
      name: 'StaffLogin',
      component: StaffLogin
    },
    {
      path: '/staff',
      name: 'StaffDashboard',
      component: StaffDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics,
      meta: { requiresAuth: true }
    },
    {
      path: '/qr',
      name: 'QRGenerator',
      component: QRGenerator,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/staff-login')
  } else {
    next()
  }
})

export default router