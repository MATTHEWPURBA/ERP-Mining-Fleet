import BookingApprovalService from '@/services/BookingApprovalService';

// Initial placeholder for booking approvals module
// This provides the minimal structure needed to prevent import errors

// Initial state with empty values
const state = {
    approvals: [],
    pendingApprovals: [],
    loading: false,
    error: null
  };
  
  // Basic getters matching the expected interface
  const getters = {
    getAllApprovals: state => state.approvals || [], // Safe fallback
    getApprovals: state => state.pendingApprovals,
    isLoading: state => state.loading,
    getError: state => state.error
  };
  
  // Placeholder actions that can be implemented later
  const actions = {
  // Fetch all approvals with optional filters
  async fetchApprovals({ commit }, filters = {}) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const response = await BookingApprovalService.getApprovals();
      commit('SET_APPROVALS', response.data);
      return Promise.resolve(response.data);
    } catch (error) {

      // Set error message and return empty array for safety
      const errorMessage = error.response?.data?.message || 'Failed to fetch approvals';
      commit('SET_ERROR', errorMessage);
      commit('SET_APPROVALS', []); // Set empty array to prevent undefined errors
      
      return Promise.reject(error);


    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Approve a booking request
  async approveBooking({ commit, dispatch }, { id, data = {} }) {
    commit('SET_LOADING', true);
    
    try {
      // Validate input
      if (!id) {
        throw new Error('Approval ID is required');
      }
      
      // Call API
      const response = await BookingApprovalService.approveBooking(id, data);
      
      // Refresh the approvals list
      dispatch('fetchApprovals');
      
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error in approveBooking action:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to approve booking');
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Reject a booking request
  async rejectBooking({ commit, dispatch }, { id, data = {} }) {
    commit('SET_LOADING', true);
    
    try {
      // Validate input
      if (!id) {
        throw new Error('Approval ID is required');
      }
      
      const response = await BookingApprovalService.rejectBooking(id, data);
      dispatch('fetchApprovals'); // Refresh the list
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error in rejectBooking action:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to reject booking');
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  }
  };
  
  // Mutations to match the actions
  const mutations = {
    SET_APPROVALS(state, approvals) {
      // Ensure approvals is an array
      state.approvals = Array.isArray(approvals) ? approvals : [];
    },
    SET_PENDING_APPROVALS(state, approvals) {
      // Ensure pendingApprovals is an array
      state.pendingApprovals = Array.isArray(approvals) ? approvals : [];
    },
    SET_LOADING(state, isLoading) {
      state.loading = !!isLoading; // Convert to boolean
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  };
  
  // Export as namespaced module
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };

  // src/store/modules/bookingApprovals.js