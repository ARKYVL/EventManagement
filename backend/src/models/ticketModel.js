import pool from '../config/db.js';

export const createBookingTransaction = async (userId, eventId, quantity) => {
  // Validate quantity at model level as a safety net
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Quantity must be a positive integer.');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Lock the event row to prevent concurrent double-booking
    const [events] = await connection.query(
      'SELECT available_tickets, price FROM events WHERE id = ? FOR UPDATE',
      [eventId]
    );

    if (events.length === 0) throw new Error('Event not found');
    const event = events[0];

    if (event.available_tickets < quantity) {
      throw new Error('Not enough tickets remaining');
    }

    // Deduct stock
    await connection.query(
      'UPDATE events SET available_tickets = available_tickets - ? WHERE id = ?',
      [quantity, eventId]
    );

    // Record order with server-calculated price
    const totalPrice = event.price * quantity;
    const [result] = await connection.query(
      'INSERT INTO bookings (user_id, event_id, quantity, total_price) VALUES (?, ?, ?, ?)',
      [userId, eventId, quantity, totalPrice]
    );

    await connection.commit();
    return { bookingId: result.insertId, totalPrice };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};