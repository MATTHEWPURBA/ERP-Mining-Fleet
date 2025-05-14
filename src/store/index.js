// This Vuex store index.js file serves as the central registry for all Vuex modules and global state management
import { createStore } from 'vuex';

// Import all the individual store modules to be registered
import auth from './modules/auth';
import bookings from './modules/bookings';
import bookingApprovals from './modules/bookingApprovals';
import dashboard from './modules/dashboard';
import fuelLogs from './modules/fuelLogs';
import locations from './modules/locations';
import maintenance from './modules/maintenance';
import reports from './modules/reports';
import users from './modules/users';
import vehicles from './modules/vehicles';
import vehicleTypes from './modules/vehicleTypes';

// Create the Vuex store with all modules and global state
const store = createStore({
  // Global state accessible from any component without namespacing
  state: {
    // Notification system state for application-wide alerts
    notifications: {
      error: null,      // Stores error message to display in UI
      success: null,    // Stores success message to display in UI
      info: null,       // Stores information message to display in UI
    },
    // Global loading state for app-wide operations
    globalLoading: false,
    // Global theme and UI state
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
  },
  
  // Global getters to access state with computation if needed
  getters: {
    // Get current error notification message
    getError: state => state.notifications.error,
    // Get current success notification message
    getSuccess: state => state.notifications.success,
    // Get current info notification message
    getInfo: state => state.notifications.info,
    // Check if there's any notification active
    hasNotification: state => !!state.notifications.error || !!state.notifications.success || !!state.notifications.info,
    // Get global loading state
    isLoading: state => state.globalLoading,
    // Check if dark mode is enabled
    isDarkMode: state => state.darkMode,
  },



  
    // Global actions that can be dispatched from any component
  actions: {
    // Set an error notification message
    setError({ commit }, message) {
      commit('SET_ERROR', message);
      
      // Auto-clear error message after 5 seconds
      setTimeout(() => {
        commit('SET_ERROR', null);
      }, 5000);
    },
    
    // Set a success notification message
    setSuccessMessage({ commit }, message) {
      commit('SET_SUCCESS', message);
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        commit('SET_SUCCESS', null);
      }, 5000);
    },
    
    // Set an info notification message
    setInfoMessage({ commit }, message) {
      commit('SET_INFO', message);
      
      // Auto-clear info message after 5 seconds
      setTimeout(() => {
        commit('SET_INFO', null);
      }, 5000);
    },
    
    // Clear all notification messages
    clearNotifications({ commit }) {
      commit('SET_ERROR', null);
      commit('SET_SUCCESS', null);
      commit('SET_INFO', null);
    },
    
    // Set global loading state
    setGlobalLoading({ commit }, isLoading) {
      commit('SET_GLOBAL_LOADING', isLoading);
    },
    
    // Toggle dark mode
    toggleDarkMode({ commit, state }) {
      const newDarkMode = !state.darkMode;
      // Persist dark mode setting to localStorage
      localStorage.setItem('darkMode', newDarkMode.toString());
      commit('SET_DARK_MODE', newDarkMode);
      
      // Apply dark mode class to document root element
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    // Initialize dark mode based on saved preference
    initDarkMode({ commit, state }) {
      // Apply dark mode class to document root element if enabled
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },



  // Global mutations to modify state - synchronized and tracked by Vue devtools
  mutations: {
    // Set error notification message
    SET_ERROR(state, message) {
      state.notifications.error = message;
    },
    
    // Set success notification message
    SET_SUCCESS(state, message) {
      state.notifications.success = message;
    },
    
    // Set info notification message
    SET_INFO(state, message) {
      state.notifications.info = message;
    },
    
    // Set global loading state
    SET_GLOBAL_LOADING(state, isLoading) {
      state.globalLoading = isLoading;
    },
    
    // Set dark mode state
    SET_DARK_MODE(state, isDarkMode) {
      state.darkMode = isDarkMode;
    },
  },
  
  
  // Register all individual modules with namespacing enabled
  modules: {
    auth,
    bookings,
    bookingApprovals,
    dashboard,
    fuelLogs,
    locations,
    maintenance,
    reports,
    users,
    vehicles,
    vehicleTypes
  },

    // Enable strict mode in development only
    strict: process.env.NODE_ENV !== 'production'




});

// Initialize global app state
store.dispatch('initDarkMode');


export default store;



// src/store/index.js