import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CustomerRegistration from '../views/CustomerRegistration.vue'
import QueueStatus from '../views/QueueStatus.vue'
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
      path: '/staff',
      name: 'StaffDashboard',
      component: StaffDashboard
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics
    },
    {
      path: '/qr',
      name: 'QRGenerator',
      component: QRGenerator
    }
  ]
})

export default router