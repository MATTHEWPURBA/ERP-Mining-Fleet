import ApiService from './ApiService';

const BookingApprovalService = {
  /**
   * Get pending approval requests for current user
   * 
   * @returns {Promise} - API response
   */
  getPendingApprovals() {
    return ApiService.get('/booking-approvals/pending');
  },
  
  /**
   * Approve a booking request
   * 
   * @param {number} approvalId - Approval ID
   * @param {Object} data - Comments and other data
   * @returns {Promise} - API response
   */
  approveBooking(approvalId, data = {}) {
    return ApiService.put(`/booking-approvals/${approvalId}/approve`, data);
  },
  
  /**
   * Reject a booking request
   * 
   * @param {number} approvalId - Approval ID
   * @param {Object} data - Rejection reason and other data
   * @returns {Promise} - API response
   */
  rejectBooking(approvalId, data = {}) {
    return ApiService.put(`/booking-approvals/${approvalId}/reject`, data);
  },
  
  /**
   * Get details of a specific approval request
   * 
   * @param {number} approvalId - Approval ID
   * @returns {Promise} - API response
   */
  getApproval(approvalId) {
    return ApiService.get(`/booking-approvals/${approvalId}`);
  }
};

export default BookingApprovalService;


// src/services/BookingApprovalService.js