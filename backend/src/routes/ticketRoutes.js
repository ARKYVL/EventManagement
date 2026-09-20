
import express from 'express';
import { bookTicket, getMyBookings } from '../controllers/ticketController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', verifyToken, bookTicket);
router.get('/my-bookings', verifyToken, getMyBookings); // Added GET route

export default router;