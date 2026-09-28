import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import instrumentRoutes from './routes/instrumentRoutes.js';
import testRoutes from './routes/testRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { db } from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'NAWI Test Report System Backend',
    timestamp: new Date().toISOString(),
    standard: 'OIML R 76-1 (2006) / Legal Metrology (General) Rules 2011'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Compatibility route for dashboard
app.get('/api/dashboard/summary', (req, res, next) => {
  req.url = '/dashboard/summary';
  return reportRoutes(req, res, next);
});

// Regulatory references direct route compatibility
app.get('/api/regulatory-references', (req, res, next) => {
  req.url = '/regulatory-references';
  return reportRoutes(req, res, next);
});

app.get('/api/rules', (req, res, next) => {
  req.url = '/rules';
  return reportRoutes(req, res, next);
});

// Centralized error handler
app.use(errorMiddleware);

// Initialize database
db.initialize().then(() => {
  console.log('[Backend] System ready and database initialized.');
});

// If run directly
const isDirectExecution = process.argv[1] && (
  process.argv[1].endsWith('backend/src/server.js') || 
  process.argv[1].endsWith('backend/server.js')
);

if (isDirectExecution && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NAWI Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
