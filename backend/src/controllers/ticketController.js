import { createBookingTransaction } from '../models/ticketModel.js';

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