import ApiService from './ApiService';

const MaintenanceService = {
  /**
   * Get maintenance records with pagination and optional filters
   * 
   * @param {number} page - Page number for pagination
   * @param {Object} filters - Optional filters
   * @returns {Promise} - API response
   */
  getMaintenanceRecords(page = 1, filters = {}) {
    // Build query parameters
    const params = {
      page,
      ...filters
    };
    
    return ApiService.get('/maintenance', { params });
  },
  
  /**
   * Get a single maintenance record by ID
   * 
   * @param {number} id - Maintenance record ID
   * @returns {Promise} - API response
   */
  getMaintenanceRecord(id) {
    return ApiService.get(`/maintenance/${id}`);
  },
  
  /**
   * Create a new maintenance record
   * 
   * @param {Object} maintenanceData - Maintenance record data
   * @returns {Promise} - API response
   */
  createMaintenanceRecord(maintenanceData) {
    return ApiService.post('/maintenance', maintenanceData);
  },
  
  /**
   * Update an existing maintenance record
   * 
   * @param {number} id - Maintenance record ID
   * @param {Object} maintenanceData - Updated maintenance data
   * @returns {Promise} - API response
   */
  updateMaintenanceRecord(id, maintenanceData) {
    return ApiService.put(`/maintenance/${id}`, maintenanceData);
  },
  
  /**
   * Delete a maintenance record
   * 
   * @param {number} id - Maintenance record ID
   * @returns {Promise} - API response
   */
  deleteMaintenanceRecord(id) {
    return ApiService.delete(`/maintenance/${id}`);
  },
  
  /**
   * Get upcoming maintenance
   * 
   * @returns {Promise} - API response
   */
  getUpcomingMaintenance() {
    return ApiService.get('/maintenance/upcoming');
  }
};

export default MaintenanceService;


// src/services/MaintenanceService.js