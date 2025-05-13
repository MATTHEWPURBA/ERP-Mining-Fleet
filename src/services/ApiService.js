import axios from 'axios';
import store from '@/store';
import router from '@/router';

// Create axios instance with base URL from environment variables
const ApiService = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // Add a timeout for requests
});

// Initialize auth header from localStorage on service creation
const token = localStorage.getItem('token');
if (token) {
  ApiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor for API calls
ApiService.interceptors.request.use(
  (config) => {
    // Get token from localStorage directly (more reliable than from store)
    const token = localStorage.getItem('token');

    // If token exists, add Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', token.substring(0, 10) + '...');
    } else {
      // Debug logging during development to help identify auth issues
      console.debug('No auth token available for request');
    }
    return config;
  },
  (error) => {
    // Log request errors for debugging
    console.error('Request error interceptor:', error);

    return Promise.reject(error);
  }
);

// Response interceptor for API calls
ApiService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.warn('401 Unauthorized - token might be invalid or expired');
      originalRequest._retry = true;

      // If token exists but is invalid, logout user
      // if (store.getters['auth/token']) {
      //   console.warn('Authentication failed with existing token - logging out');
      //   try {
      //     await store.dispatch('auth/logout');
      //   } catch (logoutError) {
      //     console.error('Error during logout after 401:', logoutError);
      //   }
      // }

      // If token exists but is invalid, logout user
      if (localStorage.getItem('token')) {
        console.log('Logging out due to invalid token');
        await store.dispatch('auth/logout');
        router.push('/login');
      }
    }

    // Log error details for debugging
    console.error('API Error Response:', error.response?.status, error.response?.data);

    return Promise.reject(error);
  }
);

export default ApiService;

// src/services/ApiService.js
