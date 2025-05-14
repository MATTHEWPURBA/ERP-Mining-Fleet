import ApiService from './ApiService';

const VehicleTypeService = {
  /**
   * Get all vehicle types
   * 
   * @returns {Promise} - API response
   */
  getVehicleTypes() {
    return ApiService.get('/vehicle-types');
  },
  
  /**
   * Get a single vehicle type by ID
   * 
   * @param {number} id - Vehicle type ID
   * @returns {Promise} - API response
   */
  getVehicleType(id) {
    return ApiService.get(`/vehicle-types/${id}`);
  },
  
  /**
   * Create a new vehicle type
   * 
   * @param {Object} vehicleTypeData - Vehicle type data
   * @returns {Promise} - API response
   */
  createVehicleType(vehicleTypeData) {
    return ApiService.post('/vehicle-types', vehicleTypeData);
  },
  
  /**
   * Update an existing vehicle type
   * 
   * @param {number} id - Vehicle type ID
   * @param {Object} vehicleTypeData - Updated vehicle type data
   * @returns {Promise} - API response
   */
  updateVehicleType(id, vehicleTypeData) {
    return ApiService.put(`/vehicle-types/${id}`, vehicleTypeData);
  },
  
  /**
   * Delete a vehicle type
   * 
   * @param {number} id - Vehicle type ID
   * @returns {Promise} - API response
   */
  deleteVehicleType(id) {
    return ApiService.delete(`/vehicle-types/${id}`);
  }
};

export default VehicleTypeService;



// src/services/VehicleTypeService.js