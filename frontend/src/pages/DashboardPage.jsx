import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiFetch('/bookings/my-bookings');
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-5 text-muted">Loading bookings...</div>;

  return (
    <div className="container py-5">
      <h3 className="fw-bold text-dark mb-4">My Booked Tickets</h3>

      {bookings.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center text-muted small">
          You haven't booked any tickets yet.
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-sm">
              <thead className="table-light text-muted">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Total Price</th>
                  <th className="py-3 px-4">Date Booked</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="py-3 px-4 fw-medium text-dark">
                      {booking.event_title || `Event #${booking.event_id}`}
                    </td>
                    <td className="py-3 px-4">{booking.quantity}</td>
                    <td className="py-3 px-4">${Number(booking.total_price).toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted small">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}