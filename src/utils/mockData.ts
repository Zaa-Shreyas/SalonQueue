import { Customer, Service } from '../stores/queue'

export const mockServices: Service[] = [
  { id: '1', name: 'Haircut', duration: 30, price: 25 },
  { id: '2', name: 'Hair Wash & Blow Dry', duration: 45, price: 35 },
  { id: '3', name: 'Hair Color', duration: 120, price: 80 },
  { id: '4', name: 'Beard Trim', duration: 20, price: 15 },
  { id: '5', name: 'Facial', duration: 60, price: 50 },
  { id: '6', name: 'Manicure', duration: 40, price: 30 },
  { id: '7', name: 'Pedicure', duration: 50, price: 40 }
]

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1234567890',
    service: 'Haircut',
    status: 'in-progress',
    estimated_wait: 15,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    position: 0
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1234567891',
    service: 'Hair Color',
    status: 'waiting',
    estimated_wait: 45,
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    position: 1
  },
  {
    id: '3',
    name: 'Mike Davis',
    phone: '+1234567892',
    service: 'Beard Trim',
    status: 'waiting',
    estimated_wait: 65,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    position: 2
  },
  {
    id: '4',
    name: 'Emily Chen',
    phone: '+1234567893',
    service: 'Facial',
    status: 'waiting',
    estimated_wait: 85,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    position: 3
  }
]

export const mockDeals = [
  {
    id: '1',
    title: '20% Off Coffee',
    description: 'Get 20% off your next coffee at Starbucks nearby',
    distance: '0.2 miles',
    validUntil: '2h 30m',
    image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Free Dessert',
    description: 'Free dessert with any main course at Bella Vista Restaurant',
    distance: '0.4 miles',
    validUntil: '1h 45m',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Buy 1 Get 1 Free',
    description: 'BOGO offer on all smoothies at Fresh Juice Bar',
    distance: '0.1 miles',
    validUntil: '3h 15m',
    image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
]

export const mockAnalytics = {
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
}