import BookingService from '@/services/BookingService';

// Initial state
const initialState = {
  bookings: [],
  booking: null,
  pagination: {
    current_page: 1,
    per_page: 15,
    total: 0
  },
  loading: false,
  error: null
};

// Getters
const getters = {
  getAllBookings: state => state.bookings,
  getBooking: state => state.booking,
  getPagination: state => state.pagination,
  isLoading: state => state.loading,
  getError: state => state.error
};

// Actions
const actions = {
  // Fetch bookings with optional filters
  async fetchBookings({ commit, dispatch }, { page = 1, filters = {} } = {}) {
    commit('SET_LOADING', true);
    
    try {
      const response = await BookingService.getBookings(page, filters);
      
      commit('SET_BOOKINGS', response.data.data);
      commit('SET_PAGINATION', {
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total: response.data.total
      });
      
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch bookings');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch bookings', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Fetch a single booking by ID
  async fetchBooking({ commit, dispatch }, id) {
    commit('SET_LOADING', true);
    
    try {
      const response = await BookingService.getBooking(id);
      commit('SET_BOOKING', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch booking');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch booking', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Create a new booking
  async createBooking({ commit, dispatch }, bookingData) {
    commit('SET_LOADING', true);
    
    try {
      const response = await BookingService.createBooking(bookingData);
      
      dispatch('setSuccessMessage', 'Booking created successfully', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to create booking');
      dispatch('setError', error.response?.data?.message || 'Failed to create booking', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Update an existing booking
  async updateBooking({ commit, dispatch, state }, { id, bookingData }) {
    commit('SET_LOADING', true);
    
    try {
      const response = await BookingService.updateBooking(id, bookingData);
      
      // Update the booking in state if it's the current one
      if (state.booking && state.booking.id === id) {
        commit('SET_BOOKING', response.data.booking);
      }
      
      dispatch('setSuccessMessage', 'Booking updated successfully', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update booking');
      dispatch('setError', error.response?.data?.message || 'Failed to update booking', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Delete a booking
  async deleteBooking({ commit, dispatch }, id) {
    commit('SET_LOADING', true);
    
    try {
      await BookingService.deleteBooking(id);
      
      // Remove booking from state
      commit('REMOVE_BOOKING', id);
      
      dispatch('setSuccessMessage', 'Booking deleted successfully', { root: true });
      return Promise.resolve();
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete booking');
      dispatch('setError', error.response?.data?.message || 'Failed to delete booking', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Complete a booking
  async completeBooking({ commit, dispatch, state }, id) {
    commit('SET_LOADING', true);
    
    try {
      const response = await BookingService.completeBooking(id);
      
      // Update the booking in state if it's the current one
      if (state.booking && state.booking.id === id) {
        commit('SET_BOOKING', response.data.booking);
      }
      
      // Update in bookings list if present
      commit('UPDATE_BOOKING_IN_LIST', response.data.booking);
      
      dispatch('setSuccessMessage', 'Booking marked as completed', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to complete booking');
      dispatch('setError', error.response?.data?.message || 'Failed to complete booking', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Cancel a booking
  async cancelBooking({ commit, dispatch, state }, id) {
    commit('SET_LOADING', true);
    
    try {
      const response = await BookingService.cancelBooking(id);
      
      // Update the booking in state if it's the current one
      if (state.booking && state.booking.id === id) {
        commit('SET_BOOKING', response.data.booking);
      }
      
      // Update in bookings list if present
      commit('UPDATE_BOOKING_IN_LIST', response.data.booking);
      
      dispatch('setSuccessMessage', 'Booking cancelled successfully', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to cancel booking');
      dispatch('setError', error.response?.data?.message || 'Failed to cancel booking', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

// Mutations
const mutations = {
  SET_BOOKINGS(state, bookings) {
    state.bookings = bookings;
  },
  SET_BOOKING(state, booking) {
    state.booking = booking;
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = pagination;
  },
  REMOVE_BOOKING(state, id) {
    state.bookings = state.bookings.filter(booking => booking.id !== id);
    
    // Clear current booking if it's the deleted one
    if (state.booking && state.booking.id === id) {
      state.booking = null;
    }
  },
  UPDATE_BOOKING_IN_LIST(state, updatedBooking) {
    const index = state.bookings.findIndex(booking => booking.id === updatedBooking.id);
    if (index !== -1) {
      state.bookings.splice(index, 1, updatedBooking);
    }
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};