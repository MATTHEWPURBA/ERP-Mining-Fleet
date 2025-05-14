import ApiService from './ApiService';

const FuelLogService = {
  /**
   * Get fuel logs with pagination and optional filters
   * 
   * @param {number} page - Page number for pagination
   * @param {Object} filters - Optional filters
   * @returns {Promise} - API response
   */
  getFuelLogs(page = 1, filters = {}) {
    // Build query parameters
    const params = {
      page,
      ...filters
    };
    
    return ApiService.get('/fuel-logs', { params });
  },
  
  /**
   * Get a single fuel log by ID
   * 
   * @param {number} id - Fuel log ID
   * @returns {Promise} - API response
   */
  getFuelLog(id) {
    return ApiService.get(`/fuel-logs/${id}`);
  },
  
  /**
   * Create a new fuel log
   * 
   * @param {Object} fuelLogData - Fuel log data
   * @returns {Promise} - API response
   */
  createFuelLog(fuelLogData) {
    return ApiService.post('/fuel-logs', fuelLogData);
  },
  
  /**
   * Update an existing fuel log
   * 
   * @param {number} id - Fuel log ID
   * @param {Object} fuelLogData - Updated fuel log data
   * @returns {Promise} - API response
   */
  updateFuelLog(id, fuelLogData) {
    return ApiService.put(`/fuel-logs/${id}`, fuelLogData);
  },
  
  /**
   * Delete a fuel log
   * 
   * @param {number} id - Fuel log ID
   * @returns {Promise} - API response
   */
  deleteFuelLog(id) {
    return ApiService.delete(`/fuel-logs/${id}`);
  },
  
  /**
   * Get vehicle consumption data
   * 
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise} - API response
   */
  getVehicleConsumption(vehicleId) {
    return ApiService.get(`/fuel-logs/vehicle/${vehicleId}/consumption`);
  }
};

export default FuelLogService;

// src/services/FuelLogService.js