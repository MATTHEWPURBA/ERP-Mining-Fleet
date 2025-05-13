import { createStore } from 'vuex';
import auth from './modules/auth';
import vehicles from './modules/vehicles';
import vehicleTypes from './modules/vehicleTypes';
import bookings from './modules/bookings';
import bookingApprovals from './modules/bookingApprovals';
import maintenance from './modules/maintenance';
import fuelLogs from './modules/fuelLogs';
import users from './modules/users';
import locations from './modules/locations';
import dashboard from './modules/dashboard';
import reports from './modules/reports';

// Create a new store instance
const store = createStore({
  state: {
    // Global app state goes here
    loading: false,
    error: null,
    successMessage: null,
    theme: localStorage.getItem('theme') || 'light'
  },
  
  getters: {
    // Global getters
    isLoading: state => state.loading,
    getError: state => state.error,
    getSuccessMessage: state => state.successMessage,
    getTheme: state => state.theme
  },
  
  mutations: {
    // Global mutations
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SUCCESS_MESSAGE(state, message) {
      state.successMessage = message;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
    CLEAR_SUCCESS_MESSAGE(state) {
      state.successMessage = null;
    },
    SET_THEME(state, theme) {
      state.theme = theme;
      localStorage.setItem('theme', theme);
    }
  },
  
  actions: {
    // Global actions
    setLoading({ commit }, isLoading) {
      commit('SET_LOADING', isLoading);
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error);
      
      // Clear error after 5 seconds
      setTimeout(() => {
        commit('CLEAR_ERROR');
      }, 5000);
    },
    setSuccessMessage({ commit }, message) {
      commit('SET_SUCCESS_MESSAGE', message);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        commit('CLEAR_SUCCESS_MESSAGE');
      }, 5000);
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR');
    },
    clearSuccessMessage({ commit }) {
      commit('CLEAR_SUCCESS_MESSAGE');
    },
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      commit('SET_THEME', newTheme);
    }
  },
  
  modules: {
    // Register all modules
    auth,
    vehicles,
    vehicleTypes,
    bookings,
    bookingApprovals,
    maintenance,
    fuelLogs,
    users,
    locations,
    dashboard,
    reports
  }
});

// Add a utility method to check if a module is registered
store.hasModule = function(moduleName) {
    return this._modules.root._children[moduleName] !== undefined;
  };
  
export default store;


// src/store/index.js