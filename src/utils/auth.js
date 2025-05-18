import store from '@/store';

/**
 * Auth guard for protecting routes
 * @param {Object} store - Vuex store
 * @returns {Function} - Route guard function
 */
export const authGuard = (to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthenticated'];
    const isAdmin = store.getters['auth/isAdmin'];
    const isApprover = store.getters['auth/isApprover'];
    
    // Check if route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
        return;
      }
      
      // Check if route requires admin role
      if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
        // Redirect to dashboard if not an admin
        next({ path: '/' });
        return;
      }
      
      // Check if route requires approver role
      if (to.matched.some(record => record.meta.requiresApprover) && !isApprover) {
        // Redirect to dashboard if not an approver
        next({ path: '/' });
        return;
      }
      
      // User is authenticated and has required role, proceed to route
      next();
    } else if (to.path === '/login' && isAuthenticated) {
      // If already authenticated and trying to access login page, redirect to dashboard
      next({ path: '/' });
    } else {
      // Route doesn't require auth, proceed
      next();
    }
  };


  export const createAuthGuard = (store) => {
    // Return a function that takes the route parameters
    return (to, from, next) => {
      // Check if the store and auth module are properly initialized
      if (!store || !store.hasModule('auth')) {
        console.warn('Auth module not ready yet, allowing navigation');
        next();
        return;
      }
      
      const isAuthenticated = store.getters['auth/isAuthenticated'];
      const isAdmin = store.getters['auth/isAdmin'];
      const isApprover = store.getters['auth/isApprover'];
      
      // Rest of your existing logic...
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          });
          return;
        }
        
        if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
          next({ path: '/' });
          return;
        }
        
        if (to.matched.some(record => record.meta.requiresApprover) && !isApprover) {
          next({ path: '/' });
          return;
        }
        
        next();
      } else if (to.path === '/login' && isAuthenticated) {
        next({ path: '/' });
      } else {
        next();
      }
    };
  };
  


  // frontend/src/utils/auth.js