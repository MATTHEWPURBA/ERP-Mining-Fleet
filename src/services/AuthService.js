import ApiService from './ApiService';

const AuthService = {
  /**
   * Login user and get token
   * 
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise} - API response
   */
  login(credentials) {
    return ApiService.post('/login', credentials);
  },
  
  /**
   * Logout user and invalidate token
   * 
   * @returns {Promise} - API response
   */
  logout() {
    return ApiService.post('/logout');
  },
  
  /**
   * Get current user profile
   * 
   * @returns {Promise} - API response with user data
   */
  getCurrentUser() {
    return ApiService.get('/user');
  },
  
  /**
   * Set auth header for API requests
   * 
   * @param {string} token - JWT token
   */
  setAuthHeader(token) {
    ApiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  /**
   * Remove auth header
   */
  removeAuthHeader() {
    delete ApiService.defaults.headers.common['Authorization'];
  }
};

export default AuthService;

// src/services/ApiService.js