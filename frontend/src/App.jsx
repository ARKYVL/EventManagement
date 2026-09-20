import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventsPage from './pages/EventsPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { useAuthStore } from './store/useAuthStore';

function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column bg-light">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}