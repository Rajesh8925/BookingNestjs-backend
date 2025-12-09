import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Safe way for Axios v1+
    (config.headers as any).set('Authorization', `Bearer ${token}`);
    (config.headers as any).set('Content-Type', 'application/json');
  }

  console.log('Outgoing headers:', (config.headers as any).toJSON());
  return config;
});

export default api;
