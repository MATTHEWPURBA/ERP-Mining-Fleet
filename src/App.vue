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
import { computed, watch, onMounted, ref } from 'vue';
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
    const storeReady = ref(false);

    // Use the route object meaningfully
    const currentPath = computed(() => route.path);
    
    onMounted(() => {
      console.log('Current route path:', route.path);
      // Check if store is properly initialized
      if (store && store._modules.root._children.auth) {
        storeReady.value = true;
      }
    });
    
    // Check if user is authenticated by looking at the store, with fallback
    const isAuthenticated = computed(() => {
      if (!storeReady.value || !store || !store.getters) {
        return false; // Default to not authenticated if store isn't ready
      }
      try {
        return store.getters['auth/isAuthenticated'];
      } catch (e) {
        console.error('Error accessing auth getter:', e);
        return false;
      }
    });
    
    // Define which routes use the admin layout
    const isAdminLayout = computed(() => {
      const adminRoutes = [
        'dashboard', 'users', 'vehicles', 'locations', 'reports', 'settings',
        'vehicle-types', 'maintenance', 'fuel-logs', 'bookings'
      ];
      
      // Check if current route should use admin layout
      return adminRoutes.some(route => route === route.name || route === route.name?.split('-')[0]);
    });
    
    // Only set up the watcher if store is ready
    if (store && store.getters) {
      watch(isAuthenticated, (newValue) => {
        if (newValue && store.getters['auth/user'] === undefined) {
          store.dispatch('auth/fetchCurrentUser').catch(e => {
            console.error('Error fetching user:', e);
          });
        }
      }, { immediate: true });
    }
    
    return {
      isAuthenticated,
      isAdminLayout,
      currentPath,
      storeReady
    };
  }
}
</script>


<!-- src/App.vue -->
