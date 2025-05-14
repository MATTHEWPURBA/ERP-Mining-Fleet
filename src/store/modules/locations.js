import LocationService from '@/services/LocationService';

// Initial state
const initialState = {
  locations: [],
  location: null,
  loading: false,
  error: null
};

// Getters
const getters = {
  getAllLocations: state => state.locations,
  getLocation: state => state.location,
  isLoading: state => state.loading,
  getError: state => state.error
};

// Actions
const actions = {
  // Fetch locations with optional filters
  async fetchLocations({ commit, dispatch }, filters = {}) {
    commit('SET_LOADING', true);
    
    try {
      const response = await LocationService.getLocations(filters);
      commit('SET_LOCATIONS', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch locations');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch locations', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Fetch a single location by ID
  async fetchLocation({ commit, dispatch }, id) {
    commit('SET_LOADING', true);
    
    try {
      const response = await LocationService.getLocation(id);
      commit('SET_LOCATION', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching location:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch location');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch location', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Create a new location
  async createLocation({ commit, dispatch }, locationData) {
    commit('SET_LOADING', true);
    
    try {
      const response = await LocationService.createLocation(locationData);
      dispatch('setSuccessMessage', 'Location created successfully', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error creating location:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to create location');
      dispatch('setError', error.response?.data?.message || 'Failed to create location', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Update an existing location
  async updateLocation({ commit, dispatch, state }, { id, locationData }) {
    commit('SET_LOADING', true);
    
    try {
      const response = await LocationService.updateLocation(id, locationData);
      
      // Update the location in state if it's the current one
      if (state.location && state.location.id === id) {
        commit('SET_LOCATION', response.data.location);
      }
      
      dispatch('setSuccessMessage', 'Location updated successfully', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error updating location:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update location');
      dispatch('setError', error.response?.data?.message || 'Failed to update location', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Delete a location
  async deleteLocation({ commit, dispatch }, id) {
    commit('SET_LOADING', true);
    
    try {
      await LocationService.deleteLocation(id);
      
      // Remove location from state
      commit('REMOVE_LOCATION', id);
      
      dispatch('setSuccessMessage', 'Location deleted successfully', { root: true });
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting location:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete location');
      dispatch('setError', error.response?.data?.message || 'Failed to delete location', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

// Mutations
const mutations = {
  SET_LOCATIONS(state, locations) {
    state.locations = locations;
  },
  SET_LOCATION(state, location) {
    state.location = location;
  },
  REMOVE_LOCATION(state, id) {
    state.locations = state.locations.filter(location => location.id !== id);
    
    // Clear current location if it's the deleted one
    if (state.location && state.location.id === id) {
      state.location = null;
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

// src/store/modules/locations.js