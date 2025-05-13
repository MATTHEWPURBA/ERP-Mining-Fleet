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
    console.log('AuthService: Logging out');
    // Try to call the logout endpoint, but don't fail if it doesn't work
    return ApiService.post('/logout').catch(error => {
      console.warn('Error during logout API call:', error);
      return Promise.resolve(); // Always resolve to ensure logout continues
    });
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
    if (token) {
      console.log('Setting auth header with token:', token.substring(0, 10) + '...');
      ApiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('Attempted to set auth header with empty token');
    }
  },
  
  /**
   * Remove auth header
   */
  removeAuthHeader() {
    console.log('Removing auth header');
    delete ApiService.defaults.headers.common['Authorization'];
  }
};

export default AuthService;

// src/services/AuthService.js