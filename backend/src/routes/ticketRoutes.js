import express from 'express';
import { bookTicket } from '../controllers/ticketController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', verifyToken, bookTicket);

export default router;