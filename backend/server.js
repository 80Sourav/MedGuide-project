import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import medicalHistoryRoutes from './routes/medicalHistoryRoutes.js';

// Validate AI Keys at startup
if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
  console.warn('⚠️  AI API Keys missing (GEMINI_API_KEY / GROQ_API_KEY). AI features running in fallback mode.');
}

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded prescription files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'MedGuide API',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/medical-history', medicalHistoryRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 MedGuide Backend Server running in ${
      process.env.NODE_ENV || 'development'
    } mode on port ${PORT}`
  );
});