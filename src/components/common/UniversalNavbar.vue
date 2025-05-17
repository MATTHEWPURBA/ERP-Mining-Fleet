<!-- src/components/common/UniversalNavbar.vue (Fixed version) -->
<template>
  <nav class="bg-blue-600 text-white shadow-lg universal-navbar">
    <!-- Main container with responsive width constraints -->
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left section: Logo and brand -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/" class="flex items-center">
              <!-- Logo/icon for the application -->
              <span class="material-icons mr-2">local_shipping</span>
              <span class="font-medium text-lg">Mining Fleet</span>
            </router-link>
          </div>

          <!-- Navigation links for desktop -->
          <div class="hidden md:block ml-10">
            <div class="flex items-center space-x-4">
              <!-- Conditionally render navigation items based on user permissions -->
              <template v-for="(item, index) in filteredNavItems" :key="index">
                <router-link :to="item.path" class="px-3 py-2 rounded-md text-sm font-medium transition-colors" :class="isActiveRoute(item.path) ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-700 hover:text-white'" :aria-current="isActiveRoute(item.path) ? 'page' : undefined">
                  <span v-if="item.icon" class="material-icons text-sm mr-1 align-text-bottom">{{ item.icon }}</span>
                  {{ item.name }}
                </router-link>
              </template>
            </div>
          </div>
        </div>

        <!-- Right section: User information and controls -->
        <div class="flex items-center space-x-4">
          <!-- Notifications - only shown if user is authenticated -->
          <div v-if="isAuthenticated" class="relative notifications-container" ref="notificationsRef">
            <button class="p-1 rounded-full text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white" @click="toggleNotifications">
              <span class="material-icons">notifications</span>
              <!-- Notification badge - conditionally rendered if there are pending notifications -->
              <span v-if="pendingNotifications > 0" class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-center">
                {{ pendingNotifications }}
              </span>
            </button>

            <!-- Notification dropdown - shown when notifications are open -->
            <div v-if="notificationsOpen" class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
              <!-- Notifications content would go here -->
              <div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Notifications</div>
            </div>
          </div>

          <!-- User dropdown menu -->
          <div class="relative ml-3 user-menu-container" ref="userMenuRef">
            <div>
              <button @click="toggleUserMenu" class="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white">
                <span class="sr-only">Open user menu</span>
                <!-- User avatar or placeholder -->
                <div class="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                  {{ userInitials }}
                </div>
                <span class="ml-2 hidden md:block">{{ userName }}</span>
                <span class="material-icons text-sm ml-1">arrow_drop_down</span>
              </button>
            </div>

            <!-- User dropdown menu - shown when user menu is open -->
            <!-- Removed @click.outside and replaced with a ref for manual handling -->
            <div v-if="userMenuOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"> Your Profile </router-link>
              <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"> Settings </router-link>
              <button @click="logout" class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Sign out</button>
            </div>
          </div>

          <!-- Mobile menu button - only visible on small screens -->
          <div class="flex md:hidden">
            <button @click="toggleMobileMenu" class="p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="sr-only">Open main menu</span>
              <!-- Icon for mobile menu -->
              <span class="material-icons" v-if="!mobileMenuOpen">menu</span>
              <span class="material-icons" v-else>close</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile navigation menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <template v-for="(item, index) in filteredNavItems" :key="index">
            <router-link :to="item.path" class="block px-3 py-2 rounded-md text-base font-medium" :class="isActiveRoute(item.path) ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-700 hover:text-white'" :aria-current="isActiveRoute(item.path) ? 'page' : undefined" @click="mobileMenuOpen = false">
              <span v-if="item.icon" class="material-icons text-sm mr-1 align-text-bottom">{{ item.icon }}</span>
              {{ item.name }}
            </router-link>
          </template>
        </div>

        <!-- Mobile user menu section -->
        <div class="pt-4 pb-3 border-t border-blue-700">
          <div class="flex items-center px-5">
            <div class="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white">
              {{ userInitials }}
            </div>
            <div class="ml-3">
              <div class="text-base font-medium leading-none text-white">{{ userName }}</div>
              <div class="text-sm font-medium leading-none text-blue-200 mt-1">{{ userEmail }}</div>
            </div>
          </div>
          <div class="mt-3 px-2 space-y-1">
            <router-link to="/profile" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700" @click="mobileMenuOpen = false"> Your Profile </router-link>
            <router-link to="/settings" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700" @click="mobileMenuOpen = false"> Settings </router-link>
            <button @click="handleMobileLogout" class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700">Sign out</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'UniversalNavbar',
  setup() {
    // Initialize core Vue ecosystem components
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    // Create refs for the dropdown containers to detect outside clicks
    const userMenuRef = ref(null);
    const notificationsRef = ref(null);

    // State for UI interactions
    const mobileMenuOpen = ref(false);
    const userMenuOpen = ref(false);
    const notificationsOpen = ref(false);

    // Create computed properties that depend on the Vuex store
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const currentUser = computed(() => store.getters['auth/user']);
    const isAdmin = computed(() => store.getters['auth/isAdmin']);
    const isApprover = computed(() => store.getters['auth/isApprover']);

    // Computed properties for user display information
    const userName = computed(() => {
      return currentUser.value?.name || 'User';
    });

    const userEmail = computed(() => {
      return currentUser.value?.email || '';
    });

    const userInitials = computed(() => {
      if (!currentUser.value?.name) return 'U';

      // Extract initials from user name
      const nameParts = currentUser.value.name.split(' ');
      if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
      }

      // Get first letter of first and last name
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    });

    // Mock for pending notifications - in a real app, this would come from the store
    const pendingNotifications = computed(() => {
      // This is a placeholder - would typically be connected to a Vuex module
      return 0;
    });

    // Define navigation items with metadata including permissions and icons
    const navigationItems = [
      {
        name: 'Dashboard',
        path: '/',
        icon: 'dashboard',
        permissions: [], // Empty array means everyone can see this
      },
      {
        name: 'Vehicles',
        path: '/vehicles',
        icon: 'directions_car',
        permissions: [],
      },
      {
        name: 'Bookings',
        path: '/bookings',
        icon: 'event',
        permissions: [],
      },
      {
        name: 'Maintenance',
        path: '/maintenance',
        icon: 'build',
        permissions: [],
      },
      {
        name: 'Fuel Logs',
        path: '/fuel-logs',
        icon: 'local_gas_station',
        permissions: [],
      },
      {
        name: 'Users',
        path: '/users',
        icon: 'people',
        permissions: ['admin'], // Only admins can see this
      },
      {
        name: 'Locations',
        path: '/locations',
        icon: 'location_on',
        permissions: ['admin'],
      },
      {
        name: 'Approvals',
        path: '/approvals',
        icon: 'fact_check',
        permissions: ['admin', 'approver'], // Admins and approvers can see this
      },
      {
        name: 'Reports',
        path: '/reports',
        icon: 'assessment',
        permissions: ['admin', 'approver'],
      },
    ];

    // Filter navigation items based on user permissions
    const filteredNavItems = computed(() => {
      return navigationItems.filter((item) => {
        // If no permissions required, show to everyone
        if (item.permissions.length === 0) {
          return true;
        }

        // Check if user has necessary permissions
        if (item.permissions.includes('admin') && isAdmin.value) {
          return true;
        }

        if (item.permissions.includes('approver') && isApprover.value) {
          return true;
        }

        return false;
      });
    });

    // Check if a route should be highlighted as active
    const isActiveRoute = (path) => {
      if (path === '/' && route.path === '/') {
        return true;
      }

      // Consider a route active if the current path starts with the nav item path
      // This handles nested routes like /vehicles/123
      if (path !== '/' && route.path.startsWith(path)) {
        return true;
      }

      return false;
    };

    // UI toggle functions
    const toggleMobileMenu = () => {
      // Close other menus when opening mobile menu
      userMenuOpen.value = false;
      notificationsOpen.value = false;
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const toggleUserMenu = () => {
      // Close other menus when opening user menu
      notificationsOpen.value = false;
      userMenuOpen.value = !userMenuOpen.value;
    };

    const toggleNotifications = () => {
      // Close other menus when opening notifications
      userMenuOpen.value = false;
      notificationsOpen.value = !notificationsOpen.value;
    };

    // Logout functionality
    const logout = async () => {
      try {
        await store.dispatch('auth/logout');
        router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    const handleMobileLogout = () => {
      mobileMenuOpen.value = false;
      logout();
    };

    // Improved click outside handler that doesn't use a custom directive
    const handleClickOutside = (event) => {
      // Handle user menu outside clicks
      if (userMenuOpen.value && userMenuRef.value) {
        // Check if the click was outside the user menu
        const isOutside = !userMenuRef.value.contains(event.target);
        if (isOutside) {
          userMenuOpen.value = false;
        }
      }

      // Handle notifications outside clicks
      if (notificationsOpen.value && notificationsRef.value) {
        // Check if the click was outside the notifications container
        const isOutside = !notificationsRef.value.contains(event.target);
        if (isOutside) {
          notificationsOpen.value = false;
        }
      }
    };

    // Close dropdown menus when route changes
    watch(
      () => route.path,
      () => {
        userMenuOpen.value = false;
        notificationsOpen.value = false;
        mobileMenuOpen.value = false;
      }
    );

    // Add and remove event listeners for click outside detection
    onMounted(() => {
      // Add global click listener for outside click detection
      document.addEventListener('click', handleClickOutside);

      // Add ESC key handler to close menus
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          userMenuOpen.value = false;
          notificationsOpen.value = false;
          mobileMenuOpen.value = false;
        }
      });
    });

    onUnmounted(() => {
      // Clean up event listeners when component is destroyed
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    });

    // Handler for ESC key to make it available to the cleanup function
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        userMenuOpen.value = false;
        notificationsOpen.value = false;
        mobileMenuOpen.value = false;
      }
    };

    return {
      // Refs for dropdown containers
      userMenuRef,
      notificationsRef,

      // State
      mobileMenuOpen,
      userMenuOpen,
      notificationsOpen,

      // Computed values
      isAuthenticated,
      currentUser,
      userName,
      userEmail,
      userInitials,
      pendingNotifications,
      filteredNavItems,

      // Methods
      isActiveRoute,
      toggleMobileMenu,
      toggleUserMenu,
      toggleNotifications,
      logout,
      handleMobileLogout,
    };
  },
};
</script>

<style scoped>
/* Add any scoped styles specific to the navbar */
.universal-navbar {
  position: relative;
  z-index: 50;
}

/* Make sure dropdowns appear above other content */
.user-menu-container .dropdown,
.notifications-container .dropdown {
  z-index: 60;
}
</style>