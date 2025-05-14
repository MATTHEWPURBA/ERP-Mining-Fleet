import ApiService from './ApiService';

const ReportService = {
  /**
   * Generate booking report
   * 
   * @param {Object} filters - Report filters
   * @param {string} format - Report format (json or excel)
   * @returns {Promise} - API response
   */
  generateBookingReport(filters, format = 'json') {
    return ApiService.post('/reports/bookings', {
      ...filters,
      format
    });
  },
  
  /**
   * Generate vehicle utilization report
   * 
   * @param {Object} filters - Report filters
   * @param {string} format - Report format (json or excel)
   * @returns {Promise} - API response
   */
  generateUtilizationReport(filters, format = 'json') {
    return ApiService.post('/reports/utilization', {
      ...filters,
      format
    });
  },
  
  /**
   * Generate maintenance report
   * 
   * @param {Object} filters - Report filters
   * @param {string} format - Report format (json or excel)
   * @returns {Promise} - API response
   */
  generateMaintenanceReport(filters, format = 'json') {
    return ApiService.post('/reports/maintenance', {
      ...filters,
      format
    });
  },
  
  /**
   * Generate fuel consumption report
   * 
   * @param {Object} filters - Report filters
   * @param {string} format - Report format (json or excel)
   * @returns {Promise} - API response
   */
  generateFuelReport(filters, format = 'json') {
    return ApiService.post('/reports/fuel', {
      ...filters,
      format
    });
  },
  
  /**
   * Download Excel report
   * 
   * @param {string} reportType - Type of report (bookings, utilization, maintenance, fuel)
   * @param {Object} filters - Report filters
   * @returns {Promise} - API response as blob for download
   */
  downloadExcelReport(reportType, filters) {
    return ApiService.post(`/reports/${reportType}/excel`, filters, {
      responseType: 'blob'
    });
  }
};

export default ReportService;


// src/services/ReportService.js