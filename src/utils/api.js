import axios from 'axios';
import { useRouter } from 'vue-router'
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      useRouter.push('/login');
    }
    return Promise.reject(error);
  }
);
export default api;