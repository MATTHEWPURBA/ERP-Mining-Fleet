import VehicleService from '@/services/VehicleService';

// Initial state
const initialState = {
  vehicles: [],
  vehicle: null,
  vehicleBookings: [],
  vehicleMaintenance: [],
  vehicleFuelLogs: [],
  pagination: {
    current_page: 1,
    per_page: 15,
    total: 0,
  },
  loading: false,
  error: null,
};

// Getters
const getters = {
  getAllVehicles: (state) => state.vehicles,
  getVehicle: (state) => state.vehicle,
  getVehicleBookings: (state) => state.vehicleBookings,
  getVehicleMaintenance: (state) => state.vehicleMaintenance,
  getVehicleFuelLogs: (state) => state.vehicleFuelLogs,
  getPagination: (state) => state.pagination,
  isLoading: (state) => state.loading,
  getError: (state) => state.error,
};

// Actions
const actions = {
  // Fetch vehicles with optional filters
  async fetchVehicles({ commit, dispatch }, { page = 1, filters = {} } = {}) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleService.getVehicles(page, filters);

      commit('SET_VEHICLES', response.data.data);
      commit('SET_PAGINATION', {
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total: response.data.total,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch vehicles');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch vehicles', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch a single vehicle by ID
  async fetchVehicle({ commit, dispatch }, id) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleService.getVehicle(id);
      commit('SET_VEHICLE', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch vehicle');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch vehicle', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Create a new vehicle
  async createVehicle({ commit, dispatch }, vehicleData) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleService.createVehicle(vehicleData);

      dispatch('setSuccessMessage', 'Vehicle created successfully', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to create vehicle');
      dispatch('setError', error.response?.data?.message || 'Failed to create vehicle', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Update an existing vehicle
  async updateVehicle({ commit, dispatch, state }, { id, vehicleData }) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleService.updateVehicle(id, vehicleData);

      // Update the vehicle in state if it's the current one
      if (state.vehicle && state.vehicle.id === id) {
        commit('SET_VEHICLE', response.data.vehicle);
      }

      dispatch('setSuccessMessage', 'Vehicle updated successfully', { root: true });
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to update vehicle');
      dispatch('setError', error.response?.data?.message || 'Failed to update vehicle', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Delete a vehicle
  async deleteVehicle({ commit, dispatch }, id) {
    commit('SET_LOADING', true);

    try {
      await VehicleService.deleteVehicle(id);

      // Remove vehicle from state
      commit('REMOVE_VEHICLE', id);

      dispatch('setSuccessMessage', 'Vehicle deleted successfully', { root: true });
      return Promise.resolve();
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to delete vehicle');
      dispatch('setError', error.response?.data?.message || 'Failed to delete vehicle', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch vehicle bookings
  async fetchVehicleBookings({ commit, dispatch }, vehicleId) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleService.getVehicleBookings(vehicleId);
      commit('SET_VEHICLE_BOOKINGS', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch vehicle bookings');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch vehicle bookings', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch vehicle maintenance records
  async fetchVehicleMaintenance({ commit, dispatch }, vehicleId) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleService.getVehicleMaintenance(vehicleId);
      commit('SET_VEHICLE_MAINTENANCE', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch vehicle maintenance');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch vehicle maintenance', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch vehicle fuel logs
  async fetchVehicleFuelLogs({ commit, dispatch }, vehicleId) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleService.getVehicleFuelLogs(vehicleId);
      commit('SET_VEHICLE_FUEL_LOGS', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch vehicle fuel logs');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch vehicle fuel logs', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Check vehicle availability for a date range
  async checkVehicleAvailability({ commit, dispatch }, filters) {
    commit('SET_LOADING', true);

    try {
      const response = await VehicleService.checkAvailability(filters);
      // Add logging to debug the response
      console.log('API response for vehicle availability:', response);
      // Ensure we're returning the data in a consistent format
      return Promise.resolve(response.data || []);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to check vehicle availability');
      dispatch('setError', error.response?.data?.message || 'Failed to check vehicle availability', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

// Mutations
const mutations = {
  SET_VEHICLES(state, vehicles) {
    state.vehicles = vehicles;
  },
  SET_VEHICLE(state, vehicle) {
    state.vehicle = vehicle;
  },
  SET_VEHICLE_BOOKINGS(state, bookings) {
    state.vehicleBookings = bookings;
  },
  SET_VEHICLE_MAINTENANCE(state, maintenance) {
    state.vehicleMaintenance = maintenance;
  },
  SET_VEHICLE_FUEL_LOGS(state, fuelLogs) {
    state.vehicleFuelLogs = fuelLogs;
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = pagination;
  },
  REMOVE_VEHICLE(state, id) {
    state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== id);

    // Clear current vehicle if it's the deleted one
    if (state.vehicle && state.vehicle.id === id) {
      state.vehicle = null;
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

// frontend/src/store/modules/vehicles.js
