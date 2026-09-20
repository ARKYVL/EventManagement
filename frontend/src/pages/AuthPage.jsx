import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (isLogin) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setSuccess('Account created successfully! Please sign in.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
      <div className="card border-0 shadow-sm rounded-3 p-4 w-100" style={{ maxWidth: '380px' }}>
        <h4 className="fw-bold text-center mb-1">{isLogin ? 'Sign In' : 'Create Account'}</h4>
        <p className="text-muted small text-center mb-4">
          {isLogin ? 'Enter your details to continue' : 'Fill in the details below'}
        </p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {success && <div className="alert alert-success py-2 small">{success}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label small fw-medium">Full Name</label>
              <input
                type="text"
                required
                className="form-control form-control-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-medium">Email Address</label>
            <input
              type="email"
              required
              className="form-control form-control-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-medium">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-control form-control-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-dark btn-sm w-100 fw-medium mt-2">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center small text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={handleToggle}
            className="btn btn-link text-decoration-none p-0 small fw-bold"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default AuthPage