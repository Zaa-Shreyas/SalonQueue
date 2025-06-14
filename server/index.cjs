const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Supabase setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mfgpkjtkyvxibzhtdxxz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZ3BranRreXZ4aWJ6aHRkeHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjE1OTcsImV4cCI6MjA2NTQ5NzU5N30.ZJtX8SdUqJ9vtkFGMxB1OrUD31Y_CODuJoPlK2QBKJI';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());

// Mock data for development
const mockCustomers = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1234567890',
    service: 'Haircut',
    status: 'in-progress',
    estimated_wait: 15,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1234567891',
    service: 'Hair Color',
    status: 'waiting',
    estimated_wait: 45,
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Mike Davis',
    phone: '+1234567892',
    service: 'Beard Trim',
    status: 'waiting',
    estimated_wait: 65,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  }
];

let customers = [...mockCustomers];

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current queue state to new client
  socket.emit('queueUpdate', customers);

  // Handle customer added
  socket.on('customerAdded', (customer) => {
    customers.push(customer);
    io.emit('queueUpdate', customers);
    io.emit('customerUpdate', customer);
  });

  // Handle customer status update
  socket.on('customerUpdated', (updatedCustomer) => {
    const index = customers.findIndex(c => c.id === updatedCustomer.id);
    if (index !== -1) {
      customers[index] = updatedCustomer;
      io.emit('queueUpdate', customers);
      io.emit('customerUpdate', updatedCustomer);
    }
  });

  // Handle customer removal
  socket.on('customerRemoved', (customerId) => {
    customers = customers.filter(c => c.id !== customerId);
    io.emit('queueUpdate', customers);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/customers', async (req, res) => {
  try {
    if (supabaseUrl === 'https://placeholder.supabase.co') {
      return res.json(customers);
    }
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    res.json(data || customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.json(customers); // Fallback to mock data
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customerData = req.body;
    
    if (supabaseUrl === 'https://placeholder.supabase.co') {
      const newCustomer = {
        ...customerData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      customers.push(newCustomer);
      io.emit('customerAdded', newCustomer);
      return res.json(newCustomer);
    }
    
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single();
    
    if (error) throw error;
    
    io.emit('customerAdded', data);
    res.json(data);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (supabaseUrl === 'https://placeholder.supabase.co') {
      const index = customers.findIndex(c => c.id === id);
      if (index !== -1) {
        customers[index] = { ...customers[index], ...updates };
        io.emit('customerUpdated', customers[index]);
        return res.json(customers[index]);
      }
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    io.emit('customerUpdated', data);
    res.json(data);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    if (supabaseUrl === 'https://placeholder.supabase.co') {
      const mockServices = [
        { id: '1', name: 'Haircut', duration: 30, price: 25 },
        { id: '2', name: 'Hair Wash & Blow Dry', duration: 45, price: 35 },
        { id: '3', name: 'Hair Color', duration: 120, price: 80 },
        { id: '4', name: 'Beard Trim', duration: 20, price: 15 },
        { id: '5', name: 'Facial', duration: 60, price: 50 },
        { id: '6', name: 'Manicure', duration: 40, price: 30 },
        { id: '7', name: 'Pedicure', duration: 50, price: 40 }
      ];
      return res.json(mockServices);
    }
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    // Mock analytics data for development
    const mockAnalytics = {
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
    };
    
    res.json(mockAnalytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Fallback route for development - redirect to frontend
app.get('/', (req, res) => {
  res.json({ 
    message: 'Salon Queue Management API Server', 
    frontend: 'http://localhost:5173',
    endpoints: {
      customers: '/api/customers',
      services: '/api/services',
      analytics: '/api/analytics',
      health: '/health'
    }
  });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🎨 Frontend should be running at http://localhost:5173`);
});