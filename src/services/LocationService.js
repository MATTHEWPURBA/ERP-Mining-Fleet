import ApiService from './ApiService';

const LocationService = {
  /**
   * Get all locations with optional filters
   * 
   * @param {Object} filters - Optional filters
   * @returns {Promise} - API response
   */
  getLocations(filters = {}) {
    return ApiService.get('/locations', { params: filters });
  },
  
  /**
   * Get a single location by ID
   * 
   * @param {number} id - Location ID
   * @returns {Promise} - API response
   */
  getLocation(id) {
    return ApiService.get(`/locations/${id}`);
  },
  
  /**
   * Create a new location
   * 
   * @param {Object} locationData - Location data
   * @returns {Promise} - API response
   */
  createLocation(locationData) {
    return ApiService.post('/locations', locationData);
  },
  
  /**
   * Update an existing location
   * 
   * @param {number} id - Location ID
   * @param {Object} locationData - Updated location data
   * @returns {Promise} - API response
   */
  updateLocation(id, locationData) {
    return ApiService.put(`/locations/${id}`, locationData);
  },
  
  /**
   * Delete a location
   * 
   * @param {number} id - Location ID
   * @returns {Promise} - API response
   */
  deleteLocation(id) {
    return ApiService.delete(`/locations/${id}`);
  }
};

export default LocationService;

// src/services/LocationService.js