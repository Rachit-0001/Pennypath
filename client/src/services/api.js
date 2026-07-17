import axios from 'axios';

// Base URL pulled from environment variables so it can point at localhost
// during development and the deployed Render URL in production.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pennypath_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Globally handle expired/invalid tokens by logging the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pennypath_token');
      localStorage.removeItem('pennypath_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
