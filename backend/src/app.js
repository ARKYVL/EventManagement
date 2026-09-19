import express from 'express';
import cors from 'cors';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Route Registration
app.use('/api/bookings', ticketRoutes);

export default app;