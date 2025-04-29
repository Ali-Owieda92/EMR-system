// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import ehrRoutes from './routes/ehrRoutes.js';
import labTestRoutes from './routes/labTestRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import womenHealthRoutes from './routes/womenHealthRoutes.js';
import userRoutes from './routes/userRoutes.js';


// Connect to database
connectDB();

const app = express();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/ehr', ehrRoutes);
app.use('/lab-tests', labTestRoutes);
app.use('/health-tracking', healthRoutes);
app.use('/women', womenHealthRoutes);
app.use('/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Healthcare API is running');
});

// Error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS, process.env.TWILIO_SID);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;