require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const donationRoutes = require('./src/routes/donations');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');
const database = require('./src/config/database');
const { swaggerUi, specs } = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.LOG_LEVEL || 'combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Food Donation API Documentation'
}));

// API Routes
app.use('/api/v1/donations', donationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Food Donation API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      donations: '/api/v1/donations',
      documentation: '/api-docs'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Initialize database
    await database.initialize();
    
    app.listen(PORT, () => {
      console.log(`🚀 Food Donation API Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`💊 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app; 