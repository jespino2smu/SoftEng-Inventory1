import axios from 'axios';

const api = axios.create({
//   baseURL: 'http://localhost:5000/api'
  baseURL: 'https://pearl-outlets-compiler-lets.trycloudflare.com/api'
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

export async function getRole() {
  return await api.post('/users/role');
  //setRole(response.data.role);
  //alert(response.data.role);
}


export default api;