import DashboardService from '@/services/DashboardService';

// Initial state
const initialState = {
  stats: {
    vehicle_count: { total: 0, available: 0, booked: 0, maintenance: 0 },
    booking_count: { total: 0, pending: 0, approved: 0, rejected: 0 },
    pending_approvals: 0,
    upcoming_maintenance: 0,
  },
  vehicleStatusDistribution: [],
  vehicleTypeDistribution: [],
  recentBookings: [],
  vehicleUtilization: [],
  fuelConsumption: [],
  userBookings: [],
  userPendingApprovals: [],
  userUpcomingBookings: [],
  userVehicles: [],
  loading: false,
  error: null,
};

// Getters
const getters = {
  getStats: (state) => state.stats,
  getVehicleStatusDistribution: (state) => state.vehicleStatusDistribution,
  getVehicleTypeDistribution: (state) => state.vehicleTypeDistribution,
  getRecentBookings: (state) => state.recentBookings,
  getVehicleUtilization: (state) => state.vehicleUtilization,
  getFuelConsumption: (state) => state.fuelConsumption,
  getUserBookings: (state) => state.userBookings,
  getUserPendingApprovals: (state) => state.userPendingApprovals,
  getUserUpcomingBookings: (state) => state.userUpcomingBookings,
  getUserVehicles: (state) => state.userVehicles,
  isLoading: (state) => state.loading,
  getError: (state) => state.error,
};

// Actions
const actions = {
  // Fetch dashboard stats
  async fetchStats({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await DashboardService.getStats();
      commit('SET_STATS', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch dashboard stats');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch dashboard stats', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch vehicle distribution data
  async fetchVehicleDistribution({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await DashboardService.getVehicleDistribution();
      commit('SET_VEHICLE_STATUS_DISTRIBUTION', response.data.vehicle_status);
      commit('SET_VEHICLE_TYPE_DISTRIBUTION', response.data.vehicle_types);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching vehicle distribution:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch vehicle distribution');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch vehicle distribution', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch recent bookings
  async fetchRecentBookings({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await DashboardService.getRecentBookings();
      commit('SET_RECENT_BOOKINGS', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch recent bookings');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch recent bookings', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch vehicle utilization data
  async fetchVehicleUtilization({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await DashboardService.getVehicleUtilization();
      commit('SET_VEHICLE_UTILIZATION', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching vehicle utilization:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch vehicle utilization');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch vehicle utilization', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch fuel consumption data
  async fetchFuelConsumption({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await DashboardService.getFuelConsumption();
      commit('SET_FUEL_CONSUMPTION', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching fuel consumption:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch fuel consumption');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch fuel consumption', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch user bookings
  async fetchUserBookings({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await DashboardService.getUserBookings();
      commit('SET_USER_BOOKINGS', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch user bookings');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch user bookings', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch user pending approvals
  async fetchUserPendingApprovals({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await DashboardService.getUserPendingApprovals();
      commit('SET_USER_PENDING_APPROVALS', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching user pending approvals:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch user pending approvals');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch user pending approvals', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch user upcoming bookings
  async fetchUserUpcomingBookings({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await DashboardService.getUserUpcomingBookings();
      commit('SET_USER_UPCOMING_BOOKINGS', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching user upcoming bookings:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch user upcoming bookings');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch user upcoming bookings', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Fetch user recently used vehicles
  async fetchUserRecentlyUsedVehicles({ commit, dispatch }) {
    commit('SET_LOADING', true);

    try {
      const response = await DashboardService.getUserRecentlyUsedVehicles();
      commit('SET_USER_VEHICLES', response.data);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch user vehicles');
      dispatch('setError', error.response?.data?.message || 'Failed to fetch user vehicles', { root: true });
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

// Mutations
const mutations = {
  SET_STATS(state, stats) {
    state.stats = stats;
  },
  SET_VEHICLE_STATUS_DISTRIBUTION(state, distribution) {
    state.vehicleStatusDistribution = distribution;
  },
  SET_VEHICLE_TYPE_DISTRIBUTION(state, distribution) {
    state.vehicleTypeDistribution = distribution;
  },
  SET_RECENT_BOOKINGS(state, bookings) {
    state.recentBookings = bookings;
  },
  SET_VEHICLE_UTILIZATION(state, utilization) {
    state.vehicleUtilization = utilization;
  },
  SET_FUEL_CONSUMPTION(state, consumption) {
    state.fuelConsumption = consumption;
  },
  SET_USER_BOOKINGS(state, bclookings) {
    state.userBookings = bookings;
  },
  SET_USER_PENDING_APPROVALS(state, approvals) {
    state.userPendingApprovals = approvals;
  },
  SET_USER_UPCOMING_BOOKINGS(state, bookings) {
    state.userUpcomingBookings = bookings;
  },
  SET_USER_VEHICLES(state, vehicles) {
    state.userVehicles = vehicles;
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
