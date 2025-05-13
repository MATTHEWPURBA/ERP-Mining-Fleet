import ApiService from './ApiService';

const DashboardService = {
  /**
   * Get dashboard statistics
   * Fetches summary statistics for the dashboard including vehicle counts, booking counts, etc.
   * 
   * @returns {Promise} - API response with statistics data
   */
  getStats() {
    return ApiService.get('/dashboard/stats');
  },
  
  /**
   * Get vehicle distribution data for charts
   * 
   * @returns {Promise} - API response
   */
  getVehicleDistribution() {
    return ApiService.get('/dashboard/vehicle-distribution');
  },
  
  /**
   * Get recent bookings for dashboard
   * 
   * @returns {Promise} - API response
   */
  getRecentBookings() {
    return ApiService.get('/dashboard/recent-bookings');
  },
  
  /**
   * Get vehicle utilization data for charts
   * 
   * @returns {Promise} - API response
   */
  getVehicleUtilization() {
    return ApiService.get('/dashboard/vehicle-utilization');
  },
  
  /**
   * Get fuel consumption data for charts
   * 
   * @returns {Promise} - API response
   */
  getFuelConsumption() {
    return ApiService.get('/dashboard/fuel-consumption');
  },
  
  /**
   * Get user's bookings for dashboard
   * 
   * @returns {Promise} - API response
   */
  getUserBookings() {
    return ApiService.get('/dashboard/user-bookings');
  },
  
  /**
   * Get user's pending approvals
   * 
   * @returns {Promise} - API response
   */
  getUserPendingApprovals() {
    return ApiService.get('/dashboard/user-approvals');
  },
  
  /**
   * Get user's upcoming bookings
   * 
   * @returns {Promise} - API response
   */
  getUserUpcomingBookings() {
    return ApiService.get('/dashboard/user-upcoming-bookings');
  },
  
  /**
   * Get user's recently used vehicles
   * 
   * @returns {Promise} - API response
   */
  getUserRecentlyUsedVehicles() {
    return ApiService.get('/dashboard/user-vehicles');
  }
};

export default DashboardService;


// src/services/DashboardService.js