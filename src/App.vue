<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Main app container -->
    <div v-if="isAuthenticated">
      <!-- Layout for authenticated users -->
      <AdminLayout v-if="isAdminLayout">
        <router-view />
      </AdminLayout>
      <DefaultLayout v-else>
        <router-view />
      </DefaultLayout>
    </div>
    <div v-else>
      <!-- Layout for non-authenticated users -->
      <AuthLayout>
        <router-view />
      </AuthLayout>
    </div>
  </div>
</template>

<script>
import { computed, watch,onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import AdminLayout from './layouts/AdminLayout.vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';

export default {
  name: 'App',
  components: {
    AdminLayout,
    DefaultLayout,
    AuthLayout
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    // Use the route object meaningfully, for example:
    const currentPath = computed(() => route.path);
    
    onMounted(() => {
      // For demonstration, log the current route path
      console.log('Current route path:', route.path);
    });
    
    // Check if user is authenticated by looking at the store
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    
    // Define which routes use the admin layout
    const isAdminLayout = computed(() => {
      const adminRoutes = [
        'dashboard', 'users', 'vehicles', 'locations', 'reports', 'settings',
        'vehicle-types', 'maintenance', 'fuel-logs', 'bookings'
      ];
      
      // Check if current route should use admin layout
      return adminRoutes.some(route => route === route.name || route === route.name?.split('-')[0]);
    });
    
    // Refresh user data if authenticated but user data missing
    watch(isAuthenticated, (newValue) => {
      if (newValue && !store.getters['auth/user']) {
        store.dispatch('auth/fetchCurrentUser');
      }
    }, { immediate: true });
    
    return {
      isAuthenticated,
      isAdminLayout,
      currentPath
    };
  }
}
</script>