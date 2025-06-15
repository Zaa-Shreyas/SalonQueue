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

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle customer added
  socket.on('customerAdded', (customer) => {
    io.emit('queueUpdate');
    io.emit('customerUpdate', customer);
  });

  // Handle customer status update
  socket.on('customerUpdated', (updatedCustomer) => {
    io.emit('queueUpdate');
    io.emit('customerUpdate', updatedCustomer);
  });

  // Handle customer removal
  socket.on('customerRemoved', (customerId) => {
    io.emit('queueUpdate');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customerData = req.body;
    
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

app.get('/api/staff', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*');
    
    if (error) {
      // Return mock staff data if Supabase fails
      const mockStaff = [
        { id: '1', name: 'John Manager', phone: '+1234567890', role: 'manager', created_at: new Date().toISOString() },
        { id: '2', name: 'Sarah Staff', phone: '+1234567891', role: 'staff', created_at: new Date().toISOString() },
        { id: '3', name: 'Mike Barber', phone: '+1234567892', role: 'staff', created_at: new Date().toISOString() }
      ];
      return res.json(mockStaff);
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Salon Queue Management API Server', 
    frontend: 'http://localhost:5173',
    endpoints: {
      customers: '/api/customers',
      services: '/api/services',
      staff: '/api/staff',
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