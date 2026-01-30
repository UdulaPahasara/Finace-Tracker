import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // SQLite service

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
};

export default api;
