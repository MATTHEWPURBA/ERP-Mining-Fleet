import axios from 'axios';
import store from '@/store';
import router from '@/router';

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    // Add authorization header with JWT token if available
    const token = store.getters['auth/token'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Logout user and redirect to login page
      store.dispatch('auth/logout').then(() => {
        router.push('/login');
      });
    }
    
    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response && error.response.status === 403) {
      store.dispatch('setError', 'You do not have permission to perform this action');
    }
    
    // Handle 422 Validation errors
    if (error.response && error.response.status === 422) {
      // Validation errors are handled by the form components
      return Promise.reject(error);
    }
    
    // Handle 500 Server errors
    if (error.response && error.response.status >= 500) {
      store.dispatch('setError', 'An unexpected server error occurred. Please try again later.');
    }
    
    // Handle network errors
    if (!error.response) {
      store.dispatch('setError', 'Network error. Please check your internet connection and try again.');
    }
    
    return Promise.reject(error);
  }
);

// frontend/src/services/interceptors.js