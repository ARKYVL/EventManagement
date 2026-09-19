import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventsPage from './Pages/EventsPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column bg-light">
        <Navbar />
        <main className="grow">
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}