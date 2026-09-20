import { create } from 'zustand';

const getSavedUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getSavedUser(),
  token: localStorage.getItem('token') || null,

  login: (userData, authToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    set({ user: userData, token: authToken });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
