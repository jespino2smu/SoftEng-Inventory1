import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api'
  // baseURL: 'http://localhost:8080/api'
  // baseURL: 'https://rebecca-sponsored-southern-ceramic.trycloudflare.com/api'
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