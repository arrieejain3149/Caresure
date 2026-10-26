const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const initDatabase = require('./config/initDatabase');

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

// Add any additional frontend URLs from environment (comma-separated)
if (process.env.FRONTEND_URLS) {
  allowedOrigins.push(...process.env.FRONTEND_URLS.split(',').map(url => url.trim()));
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowed => {
      // Exact match
      if (origin === allowed) return true;
      // Check if origin is a Vercel preview URL (starts with allowed domain)
      if (allowed.includes('vercel.app') && origin.includes('vercel.app')) return true;
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // For development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
// Vercel serverless functions only have write access to /tmp
const uploadsDir = process.env.VERCEL || process.env.VERCEL_ENV ? '/tmp/uploads' : './uploads';
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create uploads directory:', err.message);
}

// Ensure database is connected before handling routes (Important for Serverless mapping)
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/api/health') {
    return next();
  }
  try {
    await initDatabase();
    next();
  } catch (err) {
    res.status(503).json({
      error: 'Database connection unavailable',
      message: 'MongoDB is offline or unreachable. Please check MONGODB_URI in backend/.env.',
      details: err.message
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/medications', require('./routes/medications'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/medical-cards', require('./routes/medicalCards'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/patient', require('./routes/patient'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'CareSure Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      patients: '/api/patients',
      medications: '/api/medications',
      devices: '/api/devices',
      admin: '/api/admin',
    },
    documentation: 'See API documentation for details'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    message: 'CareSure API is running',
    database: dbStatus
  });
});

// Initialize database on startup
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 CareSure Backend Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.warn('⚠️ Warning: MongoDB is not connected yet:', error.message);
    console.log('👉 Tip: Start MongoDB locally or set MONGODB_URI in backend/.env to your MongoDB Atlas connection string.');
    console.log(`🚀 Starting Express server on port ${PORT} for API & health check...`);
    app.listen(PORT, () => {
      console.log(`🚀 CareSure Backend Server running on port ${PORT} (Database pending connection)`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

module.exports = app;
