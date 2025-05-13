import { createApp } from 'vue'
import App from './App.vue'

import router from './router';
import store from './store';
import './assets/css/tailwind.css';
import { createAuthGuard } from './utils/auth';

// Create and mount the Vue application
const app = createApp(App);


// Register global properties
app.config.globalProperties.$formatDate = (date) => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Register store first
app.use(store);


// Set up axios interceptors for authentication
import './services/interceptors';




// Configure global auth guard AFTER store is registered
const authGuard = createAuthGuard(store);
router.beforeEach(authGuard);


// Register plugins
app.use(router);


// Mount the app
app.mount('#app');

// src/main.js