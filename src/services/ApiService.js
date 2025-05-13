import axios from 'axios';
import store from '@/store';

// Create axios instance with base URL from environment variables
const ApiService = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for API calls
ApiService.interceptors.request.use(
  config => {
    // Get token from store
    const token = store.getters['auth/token'];
    
    // If token exists, add Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
ApiService.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If token exists but is invalid, logout user
      if (store.getters['auth/token']) {
        await store.dispatch('auth/logout');
      }
    }
    
    return Promise.reject(error);
  }
);

export default ApiService;