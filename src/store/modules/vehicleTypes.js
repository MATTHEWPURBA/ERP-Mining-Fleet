import VehicleTypeService from '@/services/VehicleTypeService';

// Initial state
const initialState = {
  vehicleTypes: [],
  vehicleType: null,
  loading: false,
  error: null,
};

// Getters
const getters = {
  getAllVehicleTypes: (state) => state.vehicleTypes,
  getVehicleType: (state) => state.vehicleType,
  isLoading: (state) => state.loading,
  getError: (state) => state.error,
};

// Actions
const actions = {
  // Fetch all vehicle types
  async fetchVehicleTypes({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleTypeService.getVehicleTypes();
      commit('SET_VEHICLE_TYPES', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch vehicle types');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch vehicle types', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch a single vehicle type by ID
  async fetchVehicleType({ commit, dispatch }, id) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleTypeService.getVehicleType(id);
      commit('SET_VEHICLE_TYPE', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching vehicle type:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch vehicle type');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch vehicle type', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Create a new vehicle type
  async createVehicleType({ commit, dispatch }, vehicleTypeData) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleTypeService.createVehicleType(vehicleTypeData);
      dispatch('setSuccessMessage', 'Vehicle type created successfully', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error creating vehicle type:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to create vehicle type');
      dispatch('setError', error.response?.data?.message || 'Failed to create vehicle type', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Update an existing vehicle type
  async updateVehicleType({ commit, dispatch, state }, { id, vehicleTypeData }) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleTypeService.updateVehicleType(id, vehicleTypeData);

      // Update the vehicle type in state if it's the current one
      if (state.vehicleType && state.vehicleType.id === id) {
        commit('SET_VEHICLE_TYPE', response.data.vehicle_type);
      }

      dispatch('setSuccessMessage', 'Vehicle type updated successfully', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error updating vehicle type:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update vehicle type');
      dispatch('setError', error.response?.data?.message || 'Failed to update vehicle type', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Delete a vehicle type
  async deleteVehicleType({ commit, dispatch }, id) {
    commit('SET_LOADING', true);

    try {
      await VehicleTypeService.deleteVehicleType(id);

      // Remove vehicle type from state
      commit('REMOVE_VEHICLE_TYPE', id);

      dispatch('setSuccessMessage', 'Vehicle type deleted successfully', { root: true });
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting vehicle type:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete vehicle type');
      dispatch('setError', error.response?.data?.message || 'Failed to delete vehicle type', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

// Mutations
const mutations = {
  SET_VEHICLE_TYPES(state, vehicleTypes) {
    state.vehicleTypes = vehicleTypes;
  },
  SET_VEHICLE_TYPE(state, vehicleType) {
    state.vehicleType = vehicleType;
  },
  REMOVE_VEHICLE_TYPE(state, id) {
    state.vehicleTypes = state.vehicleTypes.filter((type) => type.id !== id);

    // Clear current vehicle type if it's the deleted one
    if (state.vehicleType && state.vehicleType.id === id) {
      state.vehicleType = null;
    }
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations,
};

// src/store/modules/vehicleTypes.js
