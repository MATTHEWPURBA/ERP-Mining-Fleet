import ApiService from './ApiService';

const VehicleService = {
  /**
   * Get vehicles with pagination and optional filters
   *
   * @param {number} page - Page number for pagination
   * @param {Object} filters - Optional filters (status, type, etc.)
   * @returns {Promise} - API response
   */
  getVehicles(page = 1, filters = {}) {
    // Build query parameters
    const params = {
      page,
      ...filters,
    };

    return ApiService.get('/vehicles', { params });
  },

  /**
   * Get a single vehicle by ID
   *
   * @param {number} id - Vehicle ID
   * @returns {Promise} - API response
   */
  getVehicle(id) {
    return ApiService.get(`/vehicles/${id}`);
  },

  /**
   * Create a new vehicle
   *
   * @param {Object} vehicleData - Vehicle data
   * @returns {Promise} - API response
   */
  createVehicle(vehicleData) {
    return ApiService.post('/vehicles', vehicleData);
  },

  /**
   * Update an existing vehicle
   *
   * @param {number} id - Vehicle ID
   * @param {Object} vehicleData - Updated vehicle data
   * @returns {Promise} - API response
   */
  updateVehicle(id, vehicleData) {
    return ApiService.put(`/vehicles/${id}`, vehicleData);
  },

  /**
   * Delete a vehicle
   *
   * @param {number} id - Vehicle ID
   * @returns {Promise} - API response
   */
  deleteVehicle(id) {
    return ApiService.delete(`/vehicles/${id}`);
  },

  /**
   * Get bookings for a specific vehicle
   *
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise} - API response
   */
  getVehicleBookings(vehicleId) {
    return ApiService.get(`/vehicles/${vehicleId}/bookings`);
  },

  /**
   * Get maintenance records for a specific vehicle
   *
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise} - API response
   */
  getVehicleMaintenance(vehicleId) {
    return ApiService.get(`/vehicles/${vehicleId}/maintenance`);
  },

  /**
   * Get fuel logs for a specific vehicle
   *
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise} - API response
   */
  getVehicleFuelLogs(vehicleId) {
    return ApiService.get(`/vehicles/${vehicleId}/fuel-logs`);
  },

  /**
   * Check vehicle availability for a date range
   *
   * @param {Object} filters - Filters (start_date, end_date, etc.)
   * @returns {Promise} - API response
   */
  checkAvailability(filters) {
    return ApiService.get('/vehicles/availability', { params: filters });
  },
};

export default VehicleService;

// frontend/src/services/VehicleService.js
