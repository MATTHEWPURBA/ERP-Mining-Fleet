import ApiService from './ApiService';

const BookingApprovalService = {
  /**
   * Get all approval requests
   * 
   * @returns {Promise} - API response
   */
  getApprovals() {
    // Implement error handling for network failures
    try {
      return ApiService.get('/booking-approvals');
    } catch (error) {
      console.error('Network error in getApprovals:', error);
      return Promise.reject(error);
    }
  },
  
  
    /**
   * Approve a booking request
   * 
   * @param {number} approvalId - Approval ID
   * @param {Object} data - Comments and other data
   * @returns {Promise} - API response
   */
    approveBooking(approvalId, data = {}) {
      if (!approvalId) {
        return Promise.reject(new Error('Approval ID is required'));
      }
      
      try {
        return ApiService.put(`/booking-approvals/${approvalId}/approve`, data);
      } catch (error) {
        console.error('Network error in approveBooking:', error);
        return Promise.reject(error);
      }
    },
    
    /**
     * Reject a booking request
     * 
     * @param {number} approvalId - Approval ID
     * @param {Object} data - Rejection reason and other data
     * @returns {Promise} - API response
     */
    rejectBooking(approvalId, data = {}) {
      if (!approvalId) {
        return Promise.reject(new Error('Approval ID is required'));
      }
      
      try {
        return ApiService.put(`/booking-approvals/${approvalId}/reject`, data);
      } catch (error) {
        console.error('Network error in rejectBooking:', error);
        return Promise.reject(error);
      }
    },
    
    /**
     * Get details of a specific approval request
     * 
     * @param {number} approvalId - Approval ID
     * @returns {Promise} - API response
     */
    getApproval(approvalId) {
      if (!approvalId) {
        return Promise.reject(new Error('Approval ID is required'));
      }
      
      try {
        return ApiService.get(`/booking-approvals/${approvalId}`);
      } catch (error) {
        console.error('Network error in getApproval:', error);
        return Promise.reject(error);
      }
    }
};

export default BookingApprovalService;


// src/services/BookingApprovalService.js