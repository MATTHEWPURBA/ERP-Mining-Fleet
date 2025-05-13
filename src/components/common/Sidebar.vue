<template>
    <div 
      class="h-screen fixed top-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out z-30"
      :class="{'translate-x-0': isOpen, '-translate-x-full': !isOpen}"
    >
      <!-- Sidebar header -->
      <div class="p-4 border-b border-gray-800 flex items-center justify-between">
        <h1 class="text-xl font-bold">Mining Fleet</h1>
        <button 
          @click="toggleSidebar" 
          class="text-white focus:outline-none md:hidden"
        >
          <span class="material-icons">close</span>
        </button>
      </div>
      
      <!-- User profile section -->
      <div class="p-4 border-b border-gray-800">
        <div class="flex items-center">
          <div class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-xl font-semibold">
            {{ userInitials }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ user?.name || 'User' }}</p>
            <p class="text-xs text-gray-400">{{ user?.role || 'User' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Navigation links -->
      <nav class="mt-4">
        <div v-for="(section, sectionIndex) in navigationSections" :key="`section-${sectionIndex}`" class="mb-4">
          <h2 class="px-4 text-xs text-gray-500 uppercase tracking-wider">{{ section.title }}</h2>
          
          <div class="mt-2">
            <router-link 
              v-for="(item, itemIndex) in section.items"
              :key="`nav-item-${sectionIndex}-${itemIndex}`"
              :to="item.to"
              :class="[
                'flex items-center px-4 py-2 text-sm',
                isActivePath(item.to) 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              ]"
              v-show="hasPermission(item.permission)"
            >
              <span class="material-icons mr-3 text-lg">{{ item.icon }}</span>
              {{ item.text }}
            </router-link>
          </div>
        </div>
      </nav>
      
      <!-- Sidebar footer -->
      <div class="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <button 
          @click="logout" 
          class="flex items-center text-gray-400 hover:text-white w-full px-2 py-2 text-sm"
        >
          <span class="material-icons mr-3">logout</span>
          Sign out
        </button>
      </div>
    </div>
    
    <!-- Overlay for mobile -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
      @click="toggleSidebar"
    ></div>
    
    <!-- Toggle button for mobile -->
    <button 
      v-if="!isOpen"
      @click="toggleSidebar" 
      class="fixed top-4 left-4 p-2 rounded-md bg-gray-900 text-white z-20 md:hidden focus:outline-none"
    >
      <span class="material-icons">menu</span>
    </button>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  
  export default {
    name: 'Sidebar',
    emits: ['toggle'],
    props: {
      modelValue: {
        type: Boolean,
        default: true
      }
    },
    setup(props, { emit }) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();

      // Use ref to create reactive state
    const isMobileMenuOpen = ref(false);
    
    // Function to toggle mobile menu
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };
      
      // Reactive state
      const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
      });
      
      // Computed properties
      const user = computed(() => store.getters['auth/user']);
      const isAdmin = computed(() => store.getters['auth/isAdmin']);
      const isApprover = computed(() => store.getters['auth/isApprover']);
      
      const userInitials = computed(() => {
        if (!user.value) return '';
        const names = user.value.name.split(' ');
        if (names.length > 1) {
          return (names[0][0] + names[1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
      });
      
      // Navigation sections
      const navigationSections = [
        {
          title: 'Main',
          items: [
            { text: 'Dashboard', to: '/', icon: 'dashboard', permission: null },
            { text: 'Bookings', to: '/bookings', icon: 'event', permission: null },
            { text: 'Approvals', to: '/approvals', icon: 'fact_check', permission: 'isApprover' }
          ]
        },
        {
          title: 'Fleet',
          items: [
            { text: 'Vehicles', to: '/vehicles', icon: 'directions_car', permission: null },
            { text: 'Maintenance', to: '/maintenance', icon: 'build', permission: null },
            { text: 'Fuel Logs', to: '/fuel-logs', icon: 'local_gas_station', permission: null }
          ]
        },
        {
          title: 'Management',
          items: [
            { text: 'Users', to: '/users', icon: 'people', permission: 'isAdmin' },
            { text: 'Locations', to: '/locations', icon: 'location_on', permission: null },
            { text: 'Vehicle Types', to: '/vehicle-types', icon: 'category', permission: 'isAdmin' }
          ]
        },
        {
          title: 'Reports',
          items: [
            { text: 'Reports Dashboard', to: '/reports', icon: 'summarize', permission: null },
            { text: 'Booking Reports', to: '/reports/bookings', icon: 'assessment', permission: null },
            { text: 'Utilization Reports', to: '/reports/utilization', icon: 'insert_chart', permission: null },
            { text: 'Maintenance Reports', to: '/reports/maintenance', icon: 'analytics', permission: null },
            { text: 'Fuel Reports', to: '/reports/fuel', icon: 'insights', permission: null }
          ]
        }
      ];
      
      // Methods
      const toggleSidebar = () => {
        isOpen.value = !isOpen.value;
        emit('toggle', isOpen.value);
      };
      
      const logout = async () => {
        await store.dispatch('auth/logout');
        router.push('/login');
      };
      
      const isActivePath = (path) => {
        if (path === '/' && route.path === '/') return true;
        if (path !== '/' && route.path.startsWith(path)) return true;
        return false;
      };
      
      const hasPermission = (permission) => {
        if (!permission) return true;
        return store.getters[`auth/${permission}`];
      };
      
      return {
        isOpen,
        user,
        userInitials,
        isAdmin,
        isApprover,
        navigationSections,
        toggleSidebar,
        logout,
        isActivePath,
        hasPermission,
        isMobileMenuOpen,
      toggleMobileMenu
      };
    }
  };
  </script>