<template>
    <nav class="bg-white shadow-md dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left navigation section -->
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-gray-800 dark:text-white">
                Mining Fleet
              </router-link>
            </div>
            
            <!-- Navigation links for desktop -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                v-for="(item, index) in navItems"
                :key="index"
                :to="item.path"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  isActive(item.path) 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                ]"
                v-show="hasPermission(item.permission)"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          
          <!-- Right navigation section -->
          <div class="flex items-center">
            <!-- Theme toggle -->
            <button 
              @click="toggleTheme"
              class="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-300 dark:hover:text-white"
            >
              <span v-if="theme === 'dark'" class="material-icons">light_mode</span>
              <span v-else class="material-icons">dark_mode</span>
            </button>
            
            <!-- Notification bell -->
            <button 
              @click="toggleNotifications"
              class="ml-3 p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-300 dark:hover:text-white relative"
            >
              <span class="material-icons">notifications</span>
              <span 
                v-if="hasUnreadNotifications" 
                class="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"
              ></span>
            </button>
            
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button 
                  @click="toggleUserMenu"
                  class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                    {{ userInitials }}
                  </div>
                </button>
              </div>
              
              <!-- Dropdown menu -->
              <div 
                v-show="userMenuOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              >
                <router-link 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                  @click="userMenuOpen = false"
                >
                  Your Profile
                </router-link>
                <a 
                  href="#" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                  @click.prevent="logout"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-show="mobileMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link 
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.path"
            :class="[
              'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
              isActive(item.path) 
                ? 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-gray-700 dark:text-white' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
            ]"
            v-show="hasPermission(item.permission)"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
      
      <!-- Notification panel -->
      <div 
        v-show="notificationsOpen"
        class="origin-top-right absolute right-10 mt-2 w-80 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      >
        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <div v-if="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
            No notifications
          </div>
          <a 
            v-for="notification in notifications" 
            :key="notification.id"
            href="#"
            class="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
            @click.prevent="handleNotification(notification)"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <span 
                  :class="[
                    'material-icons text-2xl',
                    notification.type === 'approval' ? 'text-blue-500' : 
                    notification.type === 'booking' ? 'text-green-500' : 'text-gray-500'
                  ]"
                >
                  {{ getNotificationIcon(notification.type) }}
                </span>
              </div>
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {{ notification.message }}
                </p>
                <p class="mt-1 text-xs text-gray-400">
                  {{ formatDate(notification.created_at) }}
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import moment from 'moment';
  
  export default {
    name: 'Navbar',
    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      
      // Reactive state
      const mobileMenuOpen = ref(false);
      const userMenuOpen = ref(false);
      const notificationsOpen = ref(false);
      const notifications = ref([]);
      
      // Computed properties
      const user = computed(() => store.getters['auth/user']);
      const isAdmin = computed(() => store.getters['auth/isAdmin']);
      const isApprover = computed(() => store.getters['auth/isApprover']);
      const theme = computed(() => store.getters.getTheme);
      
      const userInitials = computed(() => {
        if (!user.value) return '';
        const names = user.value.name.split(' ');
        if (names.length > 1) {
          return (names[0][0] + names[1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
      });
      
      const hasUnreadNotifications = computed(() => {
        return notifications.value.some(notification => !notification.read);
      });
      
      // Navigation items
      const navItems = [
        { name: 'Dashboard', path: '/', permission: null },
        { name: 'Vehicles', path: '/vehicles', permission: null },
        { name: 'Bookings', path: '/bookings', permission: null },
        { name: 'Approvals', path: '/approvals', permission: 'isApprover' },
        { name: 'Maintenance', path: '/maintenance', permission: null },
        { name: 'Fuel Logs', path: '/fuel-logs', permission: null },
        { name: 'Reports', path: '/reports', permission: null },
        { name: 'Users', path: '/users', permission: 'isAdmin' },
        { name: 'Locations', path: '/locations', permission: 'isAdmin' }
      ];
      
      // Methods
      const toggleMobileMenu = () => {
        mobileMenuOpen.value = !mobileMenuOpen.value;
      };
      
      const toggleUserMenu = () => {
        userMenuOpen.value = !userMenuOpen.value;
        
        // Close other menus
        notificationsOpen.value = false;
      };
      
      const toggleNotifications = () => {
        notificationsOpen.value = !notificationsOpen.value;
        
        // Close other menus
        userMenuOpen.value = false;
      };
      
      const toggleTheme = () => {
        store.dispatch('toggleTheme');
      };
      
      const logout = async () => {
        await store.dispatch('auth/logout');
        router.push('/login');
      };
      
      const isActive = (path) => {
        if (path === '/' && route.path === '/') return true;
        if (path !== '/' && route.path.startsWith(path)) return true;
        return false;
      };
      
      const hasPermission = (permission) => {
        if (!permission) return true;
        return store.getters[`auth/${permission}`];
      };
      
      const formatDate = (date) => {
        return moment(date).fromNow();
      };
      
      const getNotificationIcon = (type) => {
        switch (type) {
          case 'approval': return 'fact_check';
          case 'booking': return 'event_available';
          case 'maintenance': return 'build';
          default: return 'notifications';
        }
      };
      
      const handleNotification = (notification) => {
        // Mark as read
        notification.read = true;
        
        // Close notification panel
        notificationsOpen.value = false;
        
        // Navigate based on notification type
        if (notification.type === 'approval') {
          router.push(`/approvals/${notification.data.id}`);
        } else if (notification.type === 'booking') {
          router.push(`/bookings/${notification.data.id}`);
        }
      };
      
      // Fetch notifications (mock implementation)
      const fetchNotifications = () => {
        // In a real app, this would call an API endpoint
        notifications.value = [
          {
            id: 1,
            type: 'approval',
            title: 'Booking Approval Required',
            message: 'New booking request from John Doe needs your approval',
            read: false,
            created_at: new Date(Date.now() - 3600000),
            data: { id: 123 }
          },
          {
            id: 2,
            type: 'booking',
            title: 'Booking Approved',
            message: 'Your booking request for Vehicle B12345XY has been approved',
            read: true,
            created_at: new Date(Date.now() - 86400000),
            data: { id: 456 }
          }
        ];
      };
      
      // Click outside handling for dropdowns
      const handleClickOutside = (event) => {
        if (userMenuOpen.value && !event.target.closest('.user-menu')) {
          userMenuOpen.value = false;
        }
        
        if (notificationsOpen.value && !event.target.closest('.notifications-menu')) {
          notificationsOpen.value = false;
        }
      };
      
      // Lifecycle hooks
      onMounted(() => {
        fetchNotifications();
        document.addEventListener('click', handleClickOutside);
      });
      
      onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
      });
      
      return {
        mobileMenuOpen,
        userMenuOpen,
        notificationsOpen,
        notifications,
        user,
        isAdmin,
        isApprover,
        theme,
        userInitials,
        hasUnreadNotifications,
        navItems,
        toggleMobileMenu,
        toggleUserMenu,
        toggleNotifications,
        toggleTheme,
        logout,
        isActive,
        hasPermission,
        formatDate,
        getNotificationIcon,
        handleNotification
      };
    }
  };
  </script>