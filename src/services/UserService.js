import ApiService from './ApiService';

const UserService = {
  /**
   * Get users with pagination and optional filters
   * 
   * @param {number} page - Page number for pagination
   * @param {Object} filters - Optional filters
   * @returns {Promise} - API response
   */
  getUsers(page = 1, filters = {}) {
    // Build query parameters
    const params = {
      page,
      ...filters
    };
    
    return ApiService.get('/users', { params });
  },
  
  /**
   * Get a single user by ID
   * 
   * @param {number} id - User ID
   * @returns {Promise} - API response
   */
  getUser(id) {
    return ApiService.get(`/users/${id}`);
  },
  
  /**
   * Create a new user
   * 
   * @param {Object} userData - User data
   * @returns {Promise} - API response
   */
  createUser(userData) {
    return ApiService.post('/users', userData);
  },
  
  /**
   * Update an existing user
   * 
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - API response
   */
  updateUser(id, userData) {
    return ApiService.put(`/users/${id}`, userData);
  },
  
  /**
   * Delete a user
   * 
   * @param {number} id - User ID
   * @returns {Promise} - API response
   */
  deleteUser(id) {
    return ApiService.delete(`/users/${id}`);
  }
};

export default UserService;