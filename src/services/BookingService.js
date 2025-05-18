import ApiService from './ApiService';

const BookingService = {
  /**
   * Get bookings with pagination and optional filters
   * 
   * @param {number} page - Page number for pagination
   * @param {Object} filters - Optional filters (status, date range, etc.)
   * @returns {Promise} - API response
   */
  getBookings(page = 1, filters = {}) {
    // Build query parameters
    const params = {
      page,
      ...filters
    };
    
    return ApiService.get('/bookings', { params });
  },
  
  /**
   * Get a single booking by ID
   * 
   * @param {number} id - Booking ID
   * @returns {Promise} - API response
   */
  getBooking(id) {
    return ApiService.get(`/bookings/${id}`);
  },
  
  /**
   * Create a new booking
   * 
   * @param {Object} bookingData - Booking data
   * @returns {Promise} - API response
   */
  createBooking(bookingData) {
    return ApiService.post('/bookings', bookingData);
  },
  
  /**
   * Update an existing booking
   * 
   * @param {number} id - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise} - API response
   */
  updateBooking(id, bookingData) {
    return ApiService.put(`/bookings/${id}`, bookingData);
  },
  
  /**
   * Delete a booking
   * 
   * @param {number} id - Booking ID
   * @returns {Promise} - API response
   */
  deleteBooking(id) {
    return ApiService.delete(`/bookings/${id}`);
  },
  
  /**
   * Mark a booking as completed
   * 
   * @param {number} id - Booking ID
   * @returns {Promise} - API response
   */
  completeBooking(id) {
    return ApiService.put(`/bookings/${id}/complete`);
  },
  
  /**
   * Cancel a booking
   * 
   * @param {number} id - Booking ID
   * @returns {Promise} - API response
   */
  cancelBooking(id) {
    return ApiService.put(`/bookings/${id}/cancel`);
  }
};

export default BookingService;

// frontend/src/services/BookingService.js