import BookingService from '@/services/BookingService';

// Initial state
const state = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
    totalPages: 1,
  },
};

// Getters
const getters = {
  // Get all bookings from state
  getAllBookings: (state) => state.bookings,

  // Get current booking detail from state
  getCurrentBooking: (state) => state.currentBooking,

  // Get loading state
  isLoading: (state) => state.loading,

  // Get error state
  getError: (state) => state.error,

  // Get pagination info
  getPagination: (state) => state.pagination,
};

// Actions
const actions = {
  // Fetch bookings with pagination and optional filters
  async fetchBookings({ commit }, { page = 1, filters = {} } = {}) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await BookingService.getBookings(page, filters);

      // Validate and transform the response if needed
      if (!response || !response.data || !response.data.data) {
        throw new Error('Invalid response format from API');
      }

      // Extract pagination data
      const { data: bookings, current_page, total, per_page, last_page } = response.data;

      // Validate bookings array
      if (!Array.isArray(bookings)) {
        throw new Error('Expected bookings data to be an array');
      }

      // Process bookings to ensure all required properties exist
      const processedBookings = bookings
        .map((booking) => {
          if (!booking) return null;

          // Ensure booking has a vehicle object
          if (!booking.vehicle) {
            booking.vehicle = {
              registration_no: 'Unknown',
              vehicleType: { name: 'Unknown' },
            };
          } else if (!booking.vehicle.vehicleType) {
            booking.vehicle.vehicleType = { name: 'Unknown' };
          }

          // Ensure booking has a user object
          if (!booking.user) {
            booking.user = { name: 'Unknown' };
          }

          return booking;
        })
        .filter((booking) => booking !== null);

      // Update state with sanitized data
      commit('SET_BOOKINGS', processedBookings);
      commit('SET_PAGINATION', {
        currentPage: current_page || 1,
        totalItems: total || 0,
        itemsPerPage: per_page || 10,
        totalPages: last_page || Math.ceil((total || 0) / (per_page || 10)),
      });

      // Return the processed response for components that need it
      return {
        data: processedBookings,
        current_page,
        total,
        per_page,
        last_page,
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      commit('SET_ERROR', error.message || 'Failed to fetch bookings');
      commit('SET_BOOKINGS', []);
      // Return empty result with default pagination
      return {
        data: [],
        current_page: 1,
        total: 0,
        per_page: 10,
        last_page: 1,
      };
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch a single booking by ID
  async fetchBooking({ commit }, id) {
    if (!id) {
      commit('SET_ERROR', 'Booking ID is required');
      return null;
    }

    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await BookingService.getBooking(id);

      if (!response || !response.data) {
        throw new Error('Invalid response format from API');
      }

      const booking = response.data;

      // Validate and ensure booking has all required properties
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Ensure booking has a vehicle object
      if (!booking.vehicle) {
        booking.vehicle = {
          registration_no: 'Unknown',
          vehicleType: { name: 'Unknown' },
        };
      } else if (!booking.vehicle.vehicleType) {
        booking.vehicle.vehicleType = { name: 'Unknown' };
      }

      // Ensure booking has a user object
      if (!booking.user) {
        booking.user = { name: 'Unknown' };
      }

      // Ensure approvals array
      if (!booking.approvals) {
        booking.approvals = [];
      }

      commit('SET_CURRENT_BOOKING', booking);
      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      commit('SET_ERROR', error.message || 'Failed to fetch booking details');
      commit('SET_CURRENT_BOOKING', null);
      return null;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Create a new booking
  async createBooking({ commit }, bookingData) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await BookingService.createBooking(bookingData);

      if (!response || !response.data) {
        throw new Error('Invalid response format from API');
      }

      const booking = response.data;
      commit('SET_CURRENT_BOOKING', booking);
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      commit('SET_ERROR', error.message || 'Failed to create booking');
      throw error; // Re-throw to let component handle it
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Update an existing booking
  async updateBooking({ commit }, { id, bookingData }) {
    if (!id) {
      commit('SET_ERROR', 'Booking ID is required');
      return null;
    }

    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await BookingService.updateBooking(id, bookingData);

      if (!response || !response.data) {
        throw new Error('Invalid response format from API');
      }

      const booking = response.data;
      commit('SET_CURRENT_BOOKING', booking);
      return booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      commit('SET_ERROR', error.message || 'Failed to update booking');
      throw error; // Re-throw to let component handle it
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Cancel a booking
  async cancelBooking({ commit, dispatch }, id) {
    if (!id) {
      commit('SET_ERROR', 'Booking ID is required');
      return false;
    }

    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      await BookingService.cancelBooking(id);

      // After cancelling, fetch the booking again to get updated data
      // This is optional - you could just update the state directly if the API returns the updated booking
      await dispatch('fetchBooking', id);

      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      commit('SET_ERROR', error.message || 'Failed to cancel booking');
      throw error; // Re-throw to let component handle it
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
  async completeBooking({ commit, dispatch }, id) {
    if (!id) {
      commit('SET_ERROR', 'Booking ID is required');
      return false;
    }

    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      await BookingService.completeBooking(id);

      // After completion, fetch the booking again to get updated data
      await dispatch('fetchBooking', id);

      return true;
    } catch (error) {
      console.error('Error completing booking:', error);
      commit('SET_ERROR', error.message || 'Failed to mark booking as completed');
      throw error; // Re-throw to let component handle it
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

// Mutations
const mutations = {
  SET_BOOKINGS(state, bookings) {
    state.bookings = bookings;
  },

  // Set current booking for detail view
  SET_CURRENT_BOOKING(state, booking) {
    state.currentBooking = booking;
  },

  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = pagination;
  },

  SET_BOOKING(state, booking) {
    state.booking = booking;
  },

  REMOVE_BOOKING(state, id) {
    state.bookings = state.bookings.filter((booking) => booking.id !== id);

    // Clear current booking if it's the deleted one
    if (state.booking && state.booking.id === id) {
      state.booking = null;
    }
  },
  UPDATE_BOOKING_IN_LIST(state, updatedBooking) {
    const index = state.bookings.findIndex((booking) => booking.id === updatedBooking.id);
    if (index !== -1) {
      state.bookings.splice(index, 1, updatedBooking);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};


// src/store/modules/bookings.js