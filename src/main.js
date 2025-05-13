import { createApp } from 'vue'
import App from './App.vue'

import router from './router';
import store from './store';
import './assets/css/tailwind.css';
import { authGuard } from './utils/auth';

// Set up axios interceptors for authentication
import './services/interceptors';





// Configure global auth guard for routes
router.beforeEach(authGuard);

// Create and mount the Vue application
const app = createApp(App);

// Register global properties
app.config.globalProperties.$formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

// Register plugins
app.use(router);
app.use(store);

// Mount the app
app.mount('#app');