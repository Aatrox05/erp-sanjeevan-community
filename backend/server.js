const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('MongoDB connection error. Running without database:', err.message);
  console.warn('⚠️  Database not available. Some features may not work.');
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Routes - wrapped in try-catch to prevent crashes
try {
  app.use('/api/auth', require('./routes/authRoutes'));
} catch (e) {
  console.warn('⚠️  Auth routes error:', e.message);
}

try {
  app.use('/api/events', require('./routes/eventRoutes'));
} catch (e) {
  console.warn('⚠️  Events routes error:', e.message);
}

try {
  app.use('/api/notifications', require('./routes/notifyRoutes'));
} catch (e) {
  console.warn('⚠️  Notifications routes error:', e.message);
}

try {
  app.use('/api/leaves', require('./routes/leaveRoutes'));
} catch (e) {
  console.warn('⚠️  Leaves routes error:', e.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('Server error:', err);
});

module.exports = app;

