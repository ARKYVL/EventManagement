import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Ticket, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex items-center gap-2 font-bold text-dark">
          <Ticket className="text-primary" size={20} />
          <span>EventPass</span>
        </Link>

        <div className="navbar-nav ms-auto align-items-center gap-3">
          <Link to="/" className="nav-link text-secondary">Events</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link text-secondary">My Bookings</Link>
              <span className="border-start h-5 my-auto" />
              <span className="d-flex align-items-center gap-1 text-dark small font-medium">
                <User size={16} className="text-muted" />
                {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-dark btn-sm px-3 font-medium">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}