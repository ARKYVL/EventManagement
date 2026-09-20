import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();

app.use(cors()); 
app.use(express.json()); 

// 🎯 ADD THIS: Logs every incoming HTTP request instantly to nodemon
app.use((req, res, next) => {
  console.log(`📥 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', ticketRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 [SERVER ERROR STACK]:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;