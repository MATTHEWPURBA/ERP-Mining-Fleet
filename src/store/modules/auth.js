import AuthService from '@/services/AuthService';
import router from '@/router';

// Initial state
const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  status: ''
};

// Getters
const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  user: state => state.user,
  token: state => state.token,
  isAdmin: state => state.user && state.user.role === 'Administrator',
  isApprover: state => state.user && (state.user.role === 'Administrator' || state.user.role === 'Approver'),
  userRole: state => state.user ? state.user.role : null
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
      commit('AUTH_ERROR');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Display error in global store
      dispatch('setError', error.response?.data?.message || 'Authentication failed', { root: true });
      
      return Promise.reject(error);
    }
  },
  
  // Logout action
  async logout({ commit }) {
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
      const response = await AuthService.getCurrentUser();
      const user = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      commit('AUTH_USER_UPDATED', user);
      
      return Promise.resolve(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      
      // If 401 Unauthorized, logout user
      if (error.response && error.response.status === 401) {
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