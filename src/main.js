import { createApp } from 'vue'
import App from './App.vue'

import router from './router';
import store from './store';
import './assets/css/tailwind.css';
import { createAuthGuard } from './utils/auth';

// Define Vue feature flags
window.__VUE_OPTIONS_API__ = true;
window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

// Create and mount the Vue application
const app = createApp(App);


// Register global properties
app.config.globalProperties.$formatDate = (date) => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};


// Configure error handling
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err);
  console.error('Component:', vm);
  console.error('Info:', info);
};


// Register store first
app.use(store);


// Set up auth token on application start
const token = localStorage.getItem('token');
if (token) {
  console.log('Initializing app with token from localStorage');
  // Import AuthService directly to avoid circular imports
  import('./services/AuthService').then(module => {
    const AuthService = module.default;
    AuthService.setAuthHeader(token);
  });
}


// Set up axios interceptors for authentication
// import './services/interceptors';




// Configure global auth guard AFTER store is registered
const authGuard = createAuthGuard(store);
router.beforeEach(authGuard);


// Register plugins
app.use(router);


// Mount the app
app.mount('#app');

// frontend/src/main.js