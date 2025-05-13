import store from '@/store';

/**
 * Auth guard for protecting routes
 * @param {Object} to - Target route
 * @param {Object} from - Current route
 * @param {Function} next - Navigation function
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