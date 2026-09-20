import { createBookingTransaction } from '../models/ticketModel.js';

import pool from '../config/db.js';

export const bookTicket = async (req, res) => {
  const { eventId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const booking = await createBookingTransaction(userId, eventId, quantity);
    res.status(201).json({ message: 'Tickets successfully booked!', booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// ... existing bookTicket controller ...

export const getMyBookings = async (req, res) => {
  const userId = req.user.id; // Extracted from verifyToken middleware
  try {
    const [bookings] = await pool.query(`
      SELECT b.id, b.quantity, b.total_price, b.created_at, e.title AS event_title 
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};