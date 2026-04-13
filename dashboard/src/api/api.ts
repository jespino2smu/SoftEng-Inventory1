import axios from 'axios';

const api = axios.create({
//   baseURL: 'http://localhost:5000/api'
  baseURL: 'https://wood-string-agencies-outside.trycloudflare.com/api'
});

// Automatically attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const logout = () => {
  localStorage.setItem('token', "");
}

export default api;