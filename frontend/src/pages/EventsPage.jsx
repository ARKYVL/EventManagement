import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Calendar, Tag } from 'lucide-react';

const EventsPage=()=> {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await apiFetch('/events');
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = async (eventId) => {
    if (!user) {
      alert('Please log in to book tickets.');
      return;
    }
    
    setStatus(null);
    try {
      await apiFetch('/bookings/book', {
        method: 'POST',
        body: JSON.stringify({ eventId, quantity: 1 }),
      });
      setStatus({ type: 'success', message: 'Ticket successfully booked!' });
      fetchEvents();
    } catch (err) {
      setStatus({ type: 'danger', message: err.message });
    }
  };

  if (loading) return <div className="text-center py-5 text-muted">Loading available events...</div>;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Upcoming Events</h2>
        <p className="text-muted small">Reserve your seats using our real-time ticket system.</p>
      </div>

      {status && (
        <div className={`alert alert-${status.type} alert-dismissible fade show text-sm mb-4`} role="alert">
          {status.message}
        </div>
      )}

      <div className="row g-4">
        {events.map((event) => (
          <div key={event.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-3">
              <div className="card-body d-flex flex-column justify-content-between p-4">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold text-dark mb-0">{event.title}</h5>
                    <span className="badge bg-light text-dark border">
                      ${Number(event.price).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="text-muted small mb-4 space-y-1">
                    <div className="d-flex align-items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <Tag size={14} />
                      <span>{event.available_tickets} tickets left</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBookTicket(event.id)}
                  disabled={event.available_tickets <= 0}
                  className="btn btn-dark w-100 btn-sm font-medium"
                >
                  {event.available_tickets > 0 ? 'Book Ticket' : 'Sold Out'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default EventsPage