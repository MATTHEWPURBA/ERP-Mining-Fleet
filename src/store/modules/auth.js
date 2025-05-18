import AuthService from '@/services/AuthService';
import router from '@/router';


// Initial state with localStorage persistence for session handling
// This ensures authentication state persists across page refreshes
const initialState = {
  // Retrieve token from localStorage if available, otherwise null
  token: localStorage.getItem('token') || null,
  // Parse user data from localStorage if available, otherwise null
  // JSON.parse can handle null values safely when localStorage item doesn't exist
  user: JSON.parse(localStorage.getItem('user')) || null,
  // Authentication process status tracking ('', 'loading', 'success', 'error')
  status: ''
};

// Getters provide computed properties from the store state
// These are accessible throughout the application via store.getters
const getters = {
  // Convert token to boolean - if token exists, user is authenticated
  isAuthenticated: state => !!state.token,
  // Expose the current authentication status for UI indicators
  authStatus: state => state.status,
  // Provide access to the user object containing profile information
  user: state => state.user,
  // Role-based access control helpers
  isAdmin: state => state.user && state.user.role === 'Administrator',
  isApprover: state => state.user && (state.user.role === 'Administrator' || state.user.role === 'Approver'),
  // Add this getter to expose the token directly for API calls
  token: state => state.token
};

// Actions
const actions = {
  // Login action
  async login({ commit, dispatch }, credentials) {
    commit('AUTH_REQUEST');
    
    try {
      const response = await AuthService.login(credentials);
      
      // Extract token and user data
      const { access_token, user } = response.data;
      

      if (!access_token) {
        throw new Error('No token received from server');
      }
      
      console.log('Login successful, received token:', access_token.substring(0, 10) + '...');
      

      // Store token in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set authorization header for future requests
      AuthService.setAuthHeader(access_token);
      
      commit('AUTH_SUCCESS', { token: access_token, user });
      
      // Navigate to dashboard
      router.push({ name: 'dashboard' });
      
      return Promise.resolve(response);
    } catch (error) {
      console.error('Login error:', error);
      commit('AUTH_ERROR');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Display error in global store
      const errorMessage = error.response?.data?.message || 'Authentication failed';
      dispatch('setError', errorMessage, { root: true });
      return Promise.reject(error);
    }
  },
  
  // Logout action
  async logout({ commit }) {
    console.log('Logout action initiated');
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset auth modules state
    commit('AUTH_LOGOUT');
    
    // Redirect to login page
    router.push({ name: 'login' });
  },
  
  // Fetch current user profile
  async fetchCurrentUser({ commit, dispatch }) {
    try {
      console.log('Fetching current user profile');

      const response = await AuthService.getCurrentUser();
      const user = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      commit('AUTH_USER_UPDATED', user);
      
      return Promise.resolve(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      
      // If 401 Unauthorized, logout user
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized response when fetching user, logging out');
        dispatch('logout');
      }
      
      return Promise.reject(error);
    }
  }
};

// Mutations
const mutations = {
  AUTH_REQUEST(state) {
    state.status = 'loading';
  },
  AUTH_SUCCESS(state, { token, user }) {
    state.status = 'success';
    state.token = token;
    state.user = user;
  },
  AUTH_ERROR(state) {
    state.status = 'error';
    state.token = null;
    state.user = null;
  },
  AUTH_LOGOUT(state) {
    state.status = '';
    state.token = null;
    state.user = null;
  },
  AUTH_USER_UPDATED(state, user) {
    state.user = user;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};



// frontend/src/store/modules/auth.js